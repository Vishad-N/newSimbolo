import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoCatalogItemDto } from './dto/create-video-catalog-item.dto';
import { UpdateVideoCatalogItemDto } from './dto/update-video-catalog-item.dto';
import { CreateVideoCatalogCategoryDto } from './dto/create-video-catalog-category.dto';
import { VideoCatalogItem, VideoCatalogCategory, VideoCatalogStatusEnum } from '@prisma/client';
import { CustomConflictException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class VideoCatalogService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('VideoCatalogService');
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getItems(categoryId?: string, search?: string, status?: VideoCatalogStatusEnum | 'ALL'): Promise<VideoCatalogItem[]> {
    const where: any = { deletedAt: null };
    if (status === 'ALL') {
      // No status filter — used by the admin catalog manager to show hidden/archived cards too.
    } else if (status) {
      where.status = status;
    } else {
      where.status = VideoCatalogStatusEnum.PUBLISHED;
    }
    if (categoryId) {
      where.categories = { some: { id: categoryId } };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    return this.prisma.videoCatalogItem.findMany({
      where,
      include: { categories: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getItemBySlug(slug: string): Promise<VideoCatalogItem> {
    const item = await this.prisma.videoCatalogItem.findUnique({
      where: { slug },
      include: { categories: true },
    });
    return this.checkEntityExists(item, 'VideoCatalogItem', slug);
  }

  async createItem(dto: CreateVideoCatalogItemDto, createdBy?: string): Promise<VideoCatalogItem> {
    const slug = this.generateSlug(dto.title);
    const existing = await this.prisma.videoCatalogItem.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Video service "${dto.title}" or slug "${slug}" already exists`);
    }

    if (dto.categoryIds?.length) {
      const count = await this.prisma.videoCatalogCategory.count({ where: { id: { in: dto.categoryIds } } });
      if (count !== dto.categoryIds.length) {
        throw new CustomConflictException('One or more category IDs are invalid');
      }
    }

    const created = await this.prisma.videoCatalogItem.create({
      data: {
        title: dto.title,
        slug,
        thumbnail: dto.thumbnail,
        previewType: dto.previewType || 'YOUTUBE',
        previewUrl: dto.previewUrl,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription || null,
        hourlyRate: dto.hourlyRate !== undefined ? dto.hourlyRate : 0,
        currency: dto.currency || 'INR',
        estimatedDelivery: dto.estimatedDelivery || null,
        recommendedDuration: dto.recommendedDuration || null,
        complexity: dto.complexity || 'MEDIUM',
        tags: dto.tags || [],
        badge: dto.badge || null,
        status: dto.status || 'PUBLISHED',
        featured: dto.featured !== undefined ? dto.featured : false,
        displayOrder: dto.displayOrder !== undefined ? dto.displayOrder : 0,
        ctaText: dto.ctaText || null,
        ctaLink: dto.ctaLink || null,
        createdBy: createdBy || null,
        categories: dto.categoryIds?.length ? { connect: dto.categoryIds.map((id) => ({ id })) } : undefined,
      },
      include: { categories: true },
    });

    this.logger.log(`Created video catalog item "${created.title}" (ID: ${created.id})`);
    return created;
  }

  async updateItem(id: string, dto: UpdateVideoCatalogItemDto, updatedBy?: string): Promise<VideoCatalogItem> {
    const item = this.checkEntityExists(
      await this.prisma.videoCatalogItem.findUnique({ where: { id } }),
      'VideoCatalogItem',
      id,
    );

    let slug = item.slug;
    if (dto.title && dto.title !== item.title) {
      slug = this.generateSlug(dto.title);
      const conflict = await this.prisma.videoCatalogItem.findFirst({ where: { slug, id: { not: id } } });
      if (conflict) {
        throw new CustomConflictException(`Video service title "${dto.title}" already exists`);
      }
    }

    if (dto.categoryIds?.length) {
      const count = await this.prisma.videoCatalogCategory.count({ where: { id: { in: dto.categoryIds } } });
      if (count !== dto.categoryIds.length) {
        throw new CustomConflictException('One or more category IDs are invalid');
      }
    }

    return this.prisma.videoCatalogItem.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title, slug }),
        ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail }),
        ...(dto.previewType !== undefined && { previewType: dto.previewType }),
        ...(dto.previewUrl !== undefined && { previewUrl: dto.previewUrl }),
        ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
        ...(dto.fullDescription !== undefined && { fullDescription: dto.fullDescription }),
        ...(dto.hourlyRate !== undefined && { hourlyRate: dto.hourlyRate }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.estimatedDelivery !== undefined && { estimatedDelivery: dto.estimatedDelivery }),
        ...(dto.recommendedDuration !== undefined && { recommendedDuration: dto.recommendedDuration }),
        ...(dto.complexity !== undefined && { complexity: dto.complexity }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.badge !== undefined && { badge: dto.badge }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.featured !== undefined && { featured: dto.featured }),
        ...(dto.displayOrder !== undefined && { displayOrder: dto.displayOrder }),
        ...(dto.ctaText !== undefined && { ctaText: dto.ctaText }),
        ...(dto.ctaLink !== undefined && { ctaLink: dto.ctaLink }),
        ...(dto.categoryIds !== undefined && { categories: { set: dto.categoryIds.map((id) => ({ id })) } }),
        updatedBy: updatedBy || null,
      },
      include: { categories: true },
    });
  }

  async deleteItem(id: string, deletedBy?: string): Promise<{ success: boolean }> {
    const item = await this.prisma.videoCatalogItem.findUnique({ where: { id } });
    this.checkEntityExists(item, 'VideoCatalogItem', id);
    await this.prisma.videoCatalogItem.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy || null },
    });
    this.logger.log(`Soft-deleted video catalog item ID: ${id}`);
    return { success: true };
  }

  async reorderItems(orderedIds: string[]): Promise<{ success: boolean }> {
    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.videoCatalogItem.update({ where: { id }, data: { displayOrder: index } }),
      ),
    );
    return { success: true };
  }

  // Categories
  async getCategories(): Promise<VideoCatalogCategory[]> {
    return this.prisma.videoCatalogCategory.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async createCategory(dto: CreateVideoCatalogCategoryDto): Promise<VideoCatalogCategory> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.prisma.videoCatalogCategory.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Category "${dto.name}" already exists`);
    }
    return this.prisma.videoCatalogCategory.create({
      data: { name: dto.name, slug, displayOrder: dto.displayOrder !== undefined ? dto.displayOrder : 0 },
    });
  }

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const c = await this.prisma.videoCatalogCategory.findUnique({ where: { id } });
    this.checkEntityExists(c, 'VideoCatalogCategory', id);
    await this.prisma.videoCatalogCategory.delete({ where: { id } });
    return { success: true };
  }
}

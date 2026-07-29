import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioProjectDto } from './dto/create-portfolio-project.dto';
import { UpdatePortfolioProjectDto } from './dto/update-portfolio-project.dto';
import { CreatePortfolioCategoryDto } from './dto/create-portfolio-category.dto';
import { PortfolioProject, PortfolioCategory, PortfolioStatusEnum } from '@prisma/client';
import { CustomConflictException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class PortfolioService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('PortfolioService');
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getProjects(
    categoryId?: string,
    serviceId?: string,
    isFeatured?: boolean,
    search?: string,
    status?: PortfolioStatusEnum,
  ): Promise<PortfolioProject[]> {
    const where: any = { deletedAt: null };
    if (status) {
      where.status = status;
    } else {
      where.status = PortfolioStatusEnum.PUBLISHED;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (serviceId) {
      where.serviceId = serviceId;
    }
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.portfolioProject.findMany({
      where,
      include: {
        category: true,
        service: { select: { id: true, name: true, slug: true } },
        coverImage: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectBySlug(slug: string): Promise<PortfolioProject> {
    const proj = await this.prisma.portfolioProject.findUnique({
      where: { slug },
      include: {
        category: true,
        service: true,
        coverImage: true,
      },
    });
    return this.checkEntityExists(proj, 'PortfolioProject', slug);
  }

  async createProject(dto: CreatePortfolioProjectDto, createdBy?: string): Promise<PortfolioProject> {
    const slug = this.generateSlug(dto.title);
    const existing = await this.prisma.portfolioProject.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Project "${dto.title}" or slug "${slug}" already exists`);
    }

    if (dto.serviceId) {
      const s = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
      this.checkEntityExists(s, 'Service', dto.serviceId);
    }
    if (dto.categoryId) {
      const c = await this.prisma.portfolioCategory.findUnique({ where: { id: dto.categoryId } });
      this.checkEntityExists(c, 'PortfolioCategory', dto.categoryId);
    }

    const created = await this.prisma.portfolioProject.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description || null,
        clientName: dto.clientName || null,
        liveUrl: dto.liveUrl || null,
        completionDate: dto.completionDate ? new Date(dto.completionDate) : null,
        status: dto.status || PortfolioStatusEnum.PUBLISHED,
        isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : false,
        serviceId: dto.serviceId || null,
        categoryId: dto.categoryId || null,
        coverImageId: dto.coverImageId || null,
        createdBy: createdBy || null,
      },
      include: { category: true, service: true, coverImage: true },
    });

    this.logger.log(`Created portfolio project "${created.title}" (ID: ${created.id})`);
    return created;
  }

  async updateProject(id: string, dto: UpdatePortfolioProjectDto, updatedBy?: string): Promise<PortfolioProject> {
    const proj = this.checkEntityExists(
      await this.prisma.portfolioProject.findUnique({ where: { id } }),
      'PortfolioProject',
      id,
    );

    let slug = proj.slug;
    if (dto.title && dto.title !== proj.title) {
      slug = this.generateSlug(dto.title);
      const conflict = await this.prisma.portfolioProject.findFirst({ where: { slug, id: { not: id } } });
      if (conflict) {
        throw new CustomConflictException(`Project title "${dto.title}" already exists`);
      }
    }

    return this.prisma.portfolioProject.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title, slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.clientName !== undefined && { clientName: dto.clientName }),
        ...(dto.liveUrl !== undefined && { liveUrl: dto.liveUrl }),
        ...(dto.completionDate !== undefined && {
          completionDate: dto.completionDate ? new Date(dto.completionDate) : null,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.serviceId !== undefined && { serviceId: dto.serviceId }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.coverImageId !== undefined && { coverImageId: dto.coverImageId }),
        updatedBy: updatedBy || null,
      },
      include: { category: true, service: true, coverImage: true },
    });
  }

  async deleteProject(id: string, deletedBy?: string): Promise<{ success: boolean }> {
    const proj = await this.prisma.portfolioProject.findUnique({ where: { id } });
    this.checkEntityExists(proj, 'PortfolioProject', id);
    await this.prisma.portfolioProject.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy || null },
    });
    this.logger.log(`Soft-deleted portfolio project ID: ${id}`);
    return { success: true };
  }

  // Categories
  async getCategories(): Promise<PortfolioCategory[]> {
    return this.prisma.portfolioCategory.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { projects: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(dto: CreatePortfolioCategoryDto): Promise<PortfolioCategory> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.prisma.portfolioCategory.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Category "${dto.name}" already exists`);
    }
    return this.prisma.portfolioCategory.create({
      data: { name: dto.name, slug, description: dto.description || null },
    });
  }

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const c = await this.prisma.portfolioCategory.findUnique({ where: { id } });
    this.checkEntityExists(c, 'PortfolioCategory', id);
    await this.prisma.portfolioCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }
}

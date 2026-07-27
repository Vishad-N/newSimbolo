import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { CreateServiceFeatureDto } from './dto/create-service-feature.dto';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto';
import { Service, ServiceCategory, ServiceFeature, ServiceFAQ } from '@prisma/client';
import { CustomConflictException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class ServicesCatalogService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('ServicesCatalogService');
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getServices(categoryId?: string, search?: string): Promise<Service[]> {
    const where: any = { deletedAt: null };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.service.findMany({
      where,
      include: {
        category: true,
        features: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { packages: true, caseStudies: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getServiceBySlug(slug: string): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      include: {
        category: true,
        features: { orderBy: { sortOrder: 'asc' } },
        faqs: { orderBy: { sortOrder: 'asc' } },
        packages: { orderBy: { basePrice: 'asc' } },
      },
    });
    return this.checkEntityExists(service, 'Service', slug);
  }

  async createService(dto: CreateServiceDto, createdBy?: string): Promise<Service> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.prisma.service.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Service with name "${dto.name}" or slug "${slug}" already exists`);
    }

    if (dto.categoryId) {
      const cat = await this.prisma.serviceCategory.findUnique({ where: { id: dto.categoryId } });
      this.checkEntityExists(cat, 'ServiceCategory', dto.categoryId);
    }

    const created = await this.prisma.service.create({
      data: {
        name: dto.name,
        slug,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription || null,
        iconUrl: dto.iconUrl || null,
        type: dto.type || 'RETAINER',
        basePrice: dto.basePrice !== undefined ? dto.basePrice : 0.0,
        categoryId: dto.categoryId || null,
        createdBy: createdBy || null,
      },
    });

    this.logger.log(`Created service "${created.name}" (ID: ${created.id})`);
    return created;
  }

  async updateService(id: string, dto: UpdateServiceDto, updatedBy?: string): Promise<Service> {
    const service = this.checkEntityExists(await this.prisma.service.findUnique({ where: { id } }), 'Service', id);

    if (dto.categoryId) {
      const cat = await this.prisma.serviceCategory.findUnique({ where: { id: dto.categoryId } });
      this.checkEntityExists(cat, 'ServiceCategory', dto.categoryId);
    }

    let slug = service.slug;
    if (dto.name && dto.name !== service.name) {
      slug = this.generateSlug(dto.name);
      const conflict = await this.prisma.service.findFirst({
        where: { slug, id: { not: id } },
      });
      if (conflict) {
        throw new CustomConflictException(`Service with name "${dto.name}" already exists`);
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name, slug }),
        ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
        ...(dto.fullDescription !== undefined && { fullDescription: dto.fullDescription }),
        ...(dto.iconUrl !== undefined && { iconUrl: dto.iconUrl }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        updatedBy: updatedBy || null,
      },
    });
  }

  async deleteService(id: string, deletedBy?: string): Promise<{ success: boolean }> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    this.checkEntityExists(service, 'Service', id);

    await this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy || null },
    });
    this.logger.log(`Soft-deleted service ID: ${id}`);
    return { success: true };
  }

  // Categories
  async getCategories(): Promise<ServiceCategory[]> {
    return this.prisma.serviceCategory.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { services: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(dto: CreateServiceCategoryDto, createdBy?: string): Promise<ServiceCategory> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.prisma.serviceCategory.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Category "${dto.name}" already exists`);
    }
    return this.prisma.serviceCategory.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || null,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
        createdBy: createdBy || null,
      },
    });
  }

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const cat = await this.prisma.serviceCategory.findUnique({ where: { id } });
    this.checkEntityExists(cat, 'ServiceCategory', id);
    await this.prisma.serviceCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }

  // Features & FAQs
  async addFeature(dto: CreateServiceFeatureDto): Promise<ServiceFeature> {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    this.checkEntityExists(service, 'Service', dto.serviceId);
    return this.prisma.serviceFeature.create({
      data: {
        name: dto.name,
        description: dto.description || null,
        serviceId: dto.serviceId,
        isIncluded: dto.isIncluded !== undefined ? dto.isIncluded : true,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
      },
    });
  }

  async deleteFeature(id: string): Promise<{ success: boolean }> {
    const feat = await this.prisma.serviceFeature.findUnique({ where: { id } });
    this.checkEntityExists(feat, 'ServiceFeature', id);
    await this.prisma.serviceFeature.delete({ where: { id } });
    return { success: true };
  }

  async addFaq(dto: CreateServiceFaqDto): Promise<ServiceFAQ> {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    this.checkEntityExists(service, 'Service', dto.serviceId);
    return this.prisma.serviceFAQ.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        serviceId: dto.serviceId,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
      },
    });
  }

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    const faq = await this.prisma.serviceFAQ.findUnique({ where: { id } });
    this.checkEntityExists(faq, 'ServiceFAQ', id);
    await this.prisma.serviceFAQ.delete({ where: { id } });
    return { success: true };
  }
}

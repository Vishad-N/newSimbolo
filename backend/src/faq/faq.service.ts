import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { FAQ, FAQCategory, FAQStatusEnum } from '@prisma/client';
import { CustomConflictException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class FaqService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('FaqService');
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getFaqs(
    categoryId?: string,
    serviceId?: string,
    isFeatured?: boolean,
    search?: string,
    status?: FAQStatusEnum,
  ): Promise<FAQ[]> {
    const where: any = { deletedAt: null };
    if (status) {
      where.status = status;
    } else {
      where.status = FAQStatusEnum.PUBLISHED;
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
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.fAQ.findMany({
      where,
      include: {
        category: true,
        service: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getFaqById(id: string): Promise<FAQ> {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
      include: { category: true, service: true },
    });
    return this.checkEntityExists(faq, 'FAQ', id);
  }

  async createFaq(dto: CreateFaqDto, createdBy?: string): Promise<FAQ> {
    if (dto.categoryId) {
      const c = await this.prisma.fAQCategory.findUnique({ where: { id: dto.categoryId } });
      this.checkEntityExists(c, 'FAQCategory', dto.categoryId);
    }
    if (dto.serviceId) {
      const s = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
      this.checkEntityExists(s, 'Service', dto.serviceId);
    }

    const created = await this.prisma.fAQ.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        status: dto.status || FAQStatusEnum.PUBLISHED,
        isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : false,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
        categoryId: dto.categoryId || null,
        serviceId: dto.serviceId || null,
        createdBy: createdBy || null,
      },
      include: { category: true, service: true },
    });

    this.logger.log(`Created FAQ "${created.question}" (ID: ${created.id})`);
    return created;
  }

  async updateFaq(id: string, dto: UpdateFaqDto, updatedBy?: string): Promise<FAQ> {
    const faq = await this.prisma.fAQ.findUnique({ where: { id } });
    this.checkEntityExists(faq, 'FAQ', id);

    return this.prisma.fAQ.update({
      where: { id },
      data: {
        ...(dto.question !== undefined && { question: dto.question }),
        ...(dto.answer !== undefined && { answer: dto.answer }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.serviceId !== undefined && { serviceId: dto.serviceId }),
        updatedBy: updatedBy || null,
      },
      include: { category: true, service: true },
    });
  }

  async deleteFaq(id: string, deletedBy?: string): Promise<{ success: boolean }> {
    const faq = await this.prisma.fAQ.findUnique({ where: { id } });
    this.checkEntityExists(faq, 'FAQ', id);
    await this.prisma.fAQ.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy || null },
    });
    this.logger.log(`Soft-deleted FAQ ID: ${id}`);
    return { success: true };
  }

  // Categories
  async getCategories(): Promise<FAQCategory[]> {
    return this.prisma.fAQCategory.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { faqs: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(dto: CreateFaqCategoryDto): Promise<FAQCategory> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.prisma.fAQCategory.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Category "${dto.name}" already exists`);
    }
    return this.prisma.fAQCategory.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || null,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
      },
    });
  }

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const c = await this.prisma.fAQCategory.findUnique({ where: { id } });
    this.checkEntityExists(c, 'FAQCategory', id);
    await this.prisma.fAQCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }
}

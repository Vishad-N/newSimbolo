import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { CreateCaseStudyCategoryDto } from './dto/create-case-study-category.dto';
import { CreateCaseStudyMetricDto } from './dto/create-case-study-metric.dto';
import { CreateBeforeAfterDto } from './dto/create-before-after.dto';
import {
  CaseStudy,
  CaseStudyCategory,
  CaseStudyMetric,
  BeforeAfterComparison,
  CaseStudyStatusEnum,
} from '@prisma/client';
import { CustomConflictException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class CaseStudiesService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('CaseStudiesService');
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getCaseStudies(
    categoryId?: string,
    serviceId?: string,
    search?: string,
    status?: CaseStudyStatusEnum,
  ): Promise<CaseStudy[]> {
    const where: any = { deletedAt: null };
    if (status) {
      where.status = status;
    } else {
      where.status = CaseStudyStatusEnum.PUBLISHED;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (serviceId) {
      where.serviceId = serviceId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.caseStudy.findMany({
      where,
      include: {
        category: true,
        service: { select: { id: true, name: true, slug: true } },
        coverImage: true,
        metrics: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { publishDate: 'desc' },
    });
  }

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy> {
    const study = await this.prisma.caseStudy.findUnique({
      where: { slug },
      include: {
        category: true,
        service: true,
        coverImage: true,
        metrics: { orderBy: { sortOrder: 'asc' } },
        beforeAfters: {
          include: { beforeMedia: true, afterMedia: true },
          orderBy: { sortOrder: 'asc' },
        },
        testimonials: true,
      },
    });
    
    if (study) {
      (study as any).beforeAfters = (study as any).beforeAfters.map((ba: any) => ({
        ...ba,
        beforeImage: ba.beforeMedia,
        afterImage: ba.afterMedia,
      }));
    }

    return this.checkEntityExists(study, 'CaseStudy', slug);
  }

  async createCaseStudy(dto: CreateCaseStudyDto, createdBy?: string): Promise<CaseStudy> {
    const slug = this.generateSlug(dto.title);
    const existing = await this.prisma.caseStudy.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Case study "${dto.title}" or slug "${slug}" already exists`);
    }

    if (dto.serviceId) {
      const s = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
      this.checkEntityExists(s, 'Service', dto.serviceId);
    }
    if (dto.categoryId) {
      const c = await this.prisma.caseStudyCategory.findUnique({ where: { id: dto.categoryId } });
      this.checkEntityExists(c, 'CaseStudyCategory', dto.categoryId);
    }

    const status = dto.status || CaseStudyStatusEnum.DRAFT;
    const publishDate = status === CaseStudyStatusEnum.PUBLISHED ? new Date() : null;

    const created = await this.prisma.caseStudy.create({
      data: {
        title: dto.title,
        slug,
        summary: dto.summary,
        challenge: dto.challenge,
        solution: dto.solution,
        results: dto.results,
        clientName: dto.clientName,
        industry: dto.industry || null,
        status,
        publishDate,
        serviceId: dto.serviceId || null,
        categoryId: dto.categoryId || null,
        coverImageId: dto.coverImageId || null,
        createdBy: createdBy || null,
      },
      include: { category: true, service: true, coverImage: true },
    });

    this.logger.log(`Created case study "${created.title}" (ID: ${created.id})`);
    return created;
  }

  async updateCaseStudy(id: string, dto: UpdateCaseStudyDto, updatedBy?: string): Promise<CaseStudy> {
    const study = this.checkEntityExists(await this.prisma.caseStudy.findUnique({ where: { id } }), 'CaseStudy', id);

    let slug = study.slug;
    if (dto.title && dto.title !== study.title) {
      slug = this.generateSlug(dto.title);
      const conflict = await this.prisma.caseStudy.findFirst({ where: { slug, id: { not: id } } });
      if (conflict) {
        throw new CustomConflictException(`Case study title "${dto.title}" already exists`);
      }
    }

    let publishDate = study.publishDate;
    if (dto.status === CaseStudyStatusEnum.PUBLISHED && study.status !== CaseStudyStatusEnum.PUBLISHED) {
      publishDate = new Date();
    }

    return this.prisma.caseStudy.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title, slug }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.challenge !== undefined && { challenge: dto.challenge }),
        ...(dto.solution !== undefined && { solution: dto.solution }),
        ...(dto.results !== undefined && { results: dto.results }),
        ...(dto.clientName !== undefined && { clientName: dto.clientName }),
        ...(dto.industry !== undefined && { industry: dto.industry }),
        ...(dto.status !== undefined && { status: dto.status, publishDate }),
        ...(dto.serviceId !== undefined && { serviceId: dto.serviceId }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.coverImageId !== undefined && { coverImageId: dto.coverImageId }),
        updatedBy: updatedBy || null,
      },
      include: { category: true, service: true, coverImage: true, metrics: true },
    });
  }

  async deleteCaseStudy(id: string, deletedBy?: string): Promise<{ success: boolean }> {
    const study = await this.prisma.caseStudy.findUnique({ where: { id } });
    this.checkEntityExists(study, 'CaseStudy', id);
    await this.prisma.caseStudy.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy || null },
    });
    this.logger.log(`Soft-deleted case study ID: ${id}`);
    return { success: true };
  }

  // Categories
  async getCategories(): Promise<CaseStudyCategory[]> {
    return this.prisma.caseStudyCategory.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { caseStudies: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(dto: CreateCaseStudyCategoryDto): Promise<CaseStudyCategory> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.prisma.caseStudyCategory.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Category "${dto.name}" already exists`);
    }
    return this.prisma.caseStudyCategory.create({
      data: { name: dto.name, slug, description: dto.description || null },
    });
  }

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const c = await this.prisma.caseStudyCategory.findUnique({ where: { id } });
    this.checkEntityExists(c, 'CaseStudyCategory', id);
    await this.prisma.caseStudyCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }

  // Metrics
  async addMetric(dto: CreateCaseStudyMetricDto): Promise<CaseStudyMetric> {
    const study = await this.prisma.caseStudy.findUnique({ where: { id: dto.caseStudyId } });
    this.checkEntityExists(study, 'CaseStudy', dto.caseStudyId);
    return this.prisma.caseStudyMetric.create({
      data: {
        label: dto.label,
        value: dto.value,
        changePercentage: dto.changePercentage || null,
        caseStudyId: dto.caseStudyId,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
      },
    });
  }

  async deleteMetric(id: string): Promise<{ success: boolean }> {
    const m = await this.prisma.caseStudyMetric.findUnique({ where: { id } });
    this.checkEntityExists(m, 'CaseStudyMetric', id);
    await this.prisma.caseStudyMetric.delete({ where: { id } });
    return { success: true };
  }

  // Before/After
  async addBeforeAfter(dto: CreateBeforeAfterDto): Promise<BeforeAfterComparison> {
    const study = await this.prisma.caseStudy.findUnique({ where: { id: dto.caseStudyId } });
    this.checkEntityExists(study, 'CaseStudy', dto.caseStudyId);
    return this.prisma.beforeAfterComparison.create({
      data: {
        title: dto.title || null,
        description: dto.description || null,
        beforeImageId: dto.beforeImageId,
        afterImageId: dto.afterImageId,
        caseStudyId: dto.caseStudyId,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
      },
      include: { beforeMedia: true, afterMedia: true },
    });
  }

  async deleteBeforeAfter(id: string): Promise<{ success: boolean }> {
    const ba = await this.prisma.beforeAfterComparison.findUnique({ where: { id } });
    this.checkEntityExists(ba, 'BeforeAfterComparison', id);
    await this.prisma.beforeAfterComparison.delete({ where: { id } });
    return { success: true };
  }
}

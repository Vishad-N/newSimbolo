import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Testimonial, TestimonialStatusEnum } from '@prisma/client';

@Injectable()
export class TestimonialsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('TestimonialsService');
  }

  async getTestimonials(
    isFeatured?: boolean,
    clientId?: string,
    caseStudyId?: string,
    status?: TestimonialStatusEnum,
  ): Promise<Testimonial[]> {
    const where: any = { deletedAt: null };
    if (status) {
      where.status = status;
    } else {
      where.status = TestimonialStatusEnum.APPROVED;
    }
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }
    if (clientId) {
      where.clientId = clientId;
    }
    if (caseStudyId) {
      where.caseStudyId = caseStudyId;
    }
    return this.prisma.testimonial.findMany({
      where,
      include: {
        client: { select: { id: true, company: { select: { name: true, industry: true } } } },
        caseStudy: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTestimonialById(id: string): Promise<Testimonial> {
    const test = await this.prisma.testimonial.findUnique({
      where: { id },
      include: { client: true, caseStudy: true },
    });
    return this.checkEntityExists(test, 'Testimonial', id);
  }

  async createTestimonial(dto: CreateTestimonialDto, createdBy?: string): Promise<Testimonial> {
    if (dto.clientId) {
      const c = await this.prisma.clientProfile.findUnique({ where: { id: dto.clientId } });
      this.checkEntityExists(c, 'ClientProfile', dto.clientId);
    }
    if (dto.caseStudyId) {
      const s = await this.prisma.caseStudy.findUnique({ where: { id: dto.caseStudyId } });
      this.checkEntityExists(s, 'CaseStudy', dto.caseStudyId);
    }

    const created = await this.prisma.testimonial.create({
      data: {
        clientName: dto.clientName,
        clientTitle: dto.clientTitle || null,
        companyName: dto.companyName || null,
        content: dto.content,
        rating: dto.rating !== undefined ? dto.rating : 5,
        status: dto.status || TestimonialStatusEnum.APPROVED,
        isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : false,
        isVerified: dto.isVerified !== undefined ? dto.isVerified : true,
        avatarUrl: dto.avatarUrl || null,
        videoReviewUrl: dto.videoReviewUrl || null,
        clientId: dto.clientId || null,
        caseStudyId: dto.caseStudyId || null,
        createdBy: createdBy || null,
      },
      include: { client: true, caseStudy: true },
    });

    this.logger.log(`Created testimonial from "${created.clientName}" (ID: ${created.id})`);
    return created;
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto, updatedBy?: string): Promise<Testimonial> {
    const test = this.checkEntityExists(await this.prisma.testimonial.findUnique({ where: { id } }), 'Testimonial', id);

    return this.prisma.testimonial.update({
      where: { id },
      data: {
        ...(dto.clientName !== undefined && { clientName: dto.clientName }),
        ...(dto.clientTitle !== undefined && { clientTitle: dto.clientTitle }),
        ...(dto.companyName !== undefined && { companyName: dto.companyName }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.isVerified !== undefined && { isVerified: dto.isVerified }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.videoReviewUrl !== undefined && { videoReviewUrl: dto.videoReviewUrl }),
        ...(dto.clientId !== undefined && { clientId: dto.clientId }),
        ...(dto.caseStudyId !== undefined && { caseStudyId: dto.caseStudyId }),
        updatedBy: updatedBy || null,
      },
      include: { client: true, caseStudy: true },
    });
  }

  async deleteTestimonial(id: string, deletedBy?: string): Promise<{ success: boolean }> {
    const test = await this.prisma.testimonial.findUnique({ where: { id } });
    this.checkEntityExists(test, 'Testimonial', id);
    await this.prisma.testimonial.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy || null },
    });
    this.logger.log(`Soft-deleted testimonial ID: ${id}`);
    return { success: true };
  }
}

import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Testimonial, TestimonialStatusEnum } from '@prisma/client';
export declare class TestimonialsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTestimonials(isFeatured?: boolean, clientId?: string, caseStudyId?: string, status?: TestimonialStatusEnum): Promise<Testimonial[]>;
    getTestimonialById(id: string): Promise<Testimonial>;
    createTestimonial(dto: CreateTestimonialDto, createdBy?: string): Promise<Testimonial>;
    updateTestimonial(id: string, dto: UpdateTestimonialDto, updatedBy?: string): Promise<Testimonial>;
    deleteTestimonial(id: string, deletedBy?: string): Promise<{
        success: boolean;
    }>;
}

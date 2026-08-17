import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { FAQ, FAQCategory, FAQStatusEnum } from '@prisma/client';
export declare class FaqService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    getFaqs(categoryId?: string, serviceId?: string, isFeatured?: boolean, search?: string, status?: FAQStatusEnum): Promise<FAQ[]>;
    getFaqById(id: string): Promise<FAQ>;
    createFaq(dto: CreateFaqDto, createdBy?: string): Promise<FAQ>;
    updateFaq(id: string, dto: UpdateFaqDto, updatedBy?: string): Promise<FAQ>;
    deleteFaq(id: string, deletedBy?: string): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<FAQCategory[]>;
    createCategory(dto: CreateFaqCategoryDto): Promise<FAQCategory>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
}

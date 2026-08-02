import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { FAQStatusEnum } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class FaqController {
    private readonly faqService;
    constructor(faqService: FaqService);
    getCategories(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        slug: string;
        sortOrder: number;
    }[]>;
    getFaqs(categoryId?: string, serviceId?: string, isFeatured?: string, search?: string, status?: FAQStatusEnum): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.FAQStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        serviceId: string | null;
        categoryId: string | null;
        sortOrder: number;
        question: string;
        answer: string;
        isFeatured: boolean;
    }[]>;
    getFaqById(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.FAQStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        serviceId: string | null;
        categoryId: string | null;
        sortOrder: number;
        question: string;
        answer: string;
        isFeatured: boolean;
    }>;
    createFaq(dto: CreateFaqDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.FAQStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        serviceId: string | null;
        categoryId: string | null;
        sortOrder: number;
        question: string;
        answer: string;
        isFeatured: boolean;
    }>;
    updateFaq(id: string, dto: UpdateFaqDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.FAQStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        serviceId: string | null;
        categoryId: string | null;
        sortOrder: number;
        question: string;
        answer: string;
        isFeatured: boolean;
    }>;
    deleteFaq(id: string, user: JwtPayload): Promise<{
        success: boolean;
    }>;
    createCategory(dto: CreateFaqCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        slug: string;
        sortOrder: number;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
}

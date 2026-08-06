import { FAQStatusEnum } from '@prisma/client';
export declare class CreateFaqDto {
    question: string;
    answer: string;
    status?: FAQStatusEnum;
    isFeatured?: boolean;
    sortOrder?: number;
    categoryId?: string | null;
    serviceId?: string | null;
}

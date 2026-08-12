import { CaseStudyStatusEnum } from '@prisma/client';
export declare class CreateCaseStudyDto {
    title: string;
    summary: string;
    challenge: string;
    solution: string;
    results: string;
    clientName: string;
    industry?: string;
    status?: CaseStudyStatusEnum;
    serviceId?: string | null;
    categoryId?: string | null;
    coverImageId?: string | null;
}

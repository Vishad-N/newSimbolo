import { TestimonialStatusEnum } from '@prisma/client';
export declare class CreateTestimonialDto {
    clientName: string;
    clientTitle?: string;
    companyName?: string;
    content: string;
    rating?: number;
    status?: TestimonialStatusEnum;
    isFeatured?: boolean;
    isVerified?: boolean;
    avatarUrl?: string;
    videoReviewUrl?: string;
    clientId?: string | null;
    caseStudyId?: string | null;
}

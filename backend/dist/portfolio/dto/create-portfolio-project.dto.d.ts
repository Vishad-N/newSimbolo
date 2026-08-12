import { PortfolioStatusEnum } from '@prisma/client';
export declare class CreatePortfolioProjectDto {
    title: string;
    description?: string;
    clientName?: string;
    liveUrl?: string;
    completionDate?: string;
    status?: PortfolioStatusEnum;
    isFeatured?: boolean;
    serviceId?: string | null;
    categoryId?: string | null;
    coverImageId?: string | null;
}

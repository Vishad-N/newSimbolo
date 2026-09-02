import { VideoCatalogComplexityEnum, VideoCatalogStatusEnum, VideoPreviewTypeEnum } from '@prisma/client';
export declare class CreateVideoCatalogItemDto {
    title: string;
    categoryIds?: string[];
    thumbnail: string;
    previewType?: VideoPreviewTypeEnum;
    previewUrl: string;
    shortDescription: string;
    fullDescription?: string;
    hourlyRate?: number;
    currency?: string;
    estimatedDelivery?: string;
    recommendedDuration?: string;
    complexity?: VideoCatalogComplexityEnum;
    tags?: string[];
    badge?: string;
    status?: VideoCatalogStatusEnum;
    featured?: boolean;
    displayOrder?: number;
    ctaText?: string;
    ctaLink?: string;
}

import { ServiceTypeEnum } from '@prisma/client';
export declare class CreateServiceDto {
    name: string;
    shortDescription: string;
    fullDescription?: string;
    iconUrl?: string;
    type?: ServiceTypeEnum;
    basePrice?: number;
    categoryId?: string | null;
}

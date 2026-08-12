import { PackageTypeEnum } from '@prisma/client';
export declare class CreatePackageDto {
    name: string;
    description?: string;
    type?: PackageTypeEnum;
    serviceId: string;
    basePrice?: number;
    billingInterval?: string;
    isPopular?: boolean;
    isAddon?: boolean;
    isCustom?: boolean;
}

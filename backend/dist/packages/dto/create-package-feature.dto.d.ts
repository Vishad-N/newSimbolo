import { PackageFeatureKindEnum } from '@prisma/client';
export declare class CreatePackageFeatureDto {
    name: string;
    description?: string;
    packageId: string;
    isIncluded?: boolean;
    kind?: PackageFeatureKindEnum;
    limitValue?: string;
    sortOrder?: number;
}

import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreatePackageFeatureDto } from './dto/create-package-feature.dto';
import { PackagePricingDto } from './dto/package-pricing.dto';
import { Package, PackageFeature, PackagePricing, PackageTypeEnum } from '@prisma/client';
export declare class PackagesService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    getPackages(serviceId?: string, type?: PackageTypeEnum): Promise<Package[]>;
    getPackageBySlug(slug: string): Promise<Package>;
    createPackage(dto: CreatePackageDto, createdBy?: string): Promise<Package>;
    updatePackage(id: string, dto: UpdatePackageDto, updatedBy?: string): Promise<Package>;
    deletePackage(id: string, deletedBy?: string): Promise<{
        success: boolean;
    }>;
    addFeature(dto: CreatePackageFeatureDto): Promise<PackageFeature>;
    deleteFeature(id: string): Promise<{
        success: boolean;
    }>;
    upsertPricing(dto: PackagePricingDto): Promise<PackagePricing>;
    deletePricing(id: string): Promise<{
        success: boolean;
    }>;
}

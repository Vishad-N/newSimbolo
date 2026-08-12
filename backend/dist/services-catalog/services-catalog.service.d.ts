import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { CreateServiceFeatureDto } from './dto/create-service-feature.dto';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto';
import { Service, ServiceCategory, ServiceFeature, ServiceFAQ } from '@prisma/client';
export declare class ServicesCatalogService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    getServices(categoryId?: string, search?: string): Promise<Service[]>;
    getServiceBySlug(slug: string): Promise<Service>;
    createService(dto: CreateServiceDto, createdBy?: string): Promise<Service>;
    updateService(id: string, dto: UpdateServiceDto, updatedBy?: string): Promise<Service>;
    deleteService(id: string, deletedBy?: string): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<ServiceCategory[]>;
    createCategory(dto: CreateServiceCategoryDto, createdBy?: string): Promise<ServiceCategory>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    addFeature(dto: CreateServiceFeatureDto): Promise<ServiceFeature>;
    deleteFeature(id: string): Promise<{
        success: boolean;
    }>;
    addFaq(dto: CreateServiceFaqDto): Promise<ServiceFAQ>;
    deleteFaq(id: string): Promise<{
        success: boolean;
    }>;
}

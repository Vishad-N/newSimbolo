import { ServicesCatalogService } from './services-catalog.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { CreateServiceFeatureDto } from './dto/create-service-feature.dto';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class ServicesCatalogController {
    private readonly servicesCatalogService;
    constructor(servicesCatalogService: ServicesCatalogService);
    getCategories(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
        slug: string;
        sortOrder: number;
    }[]>;
    getServices(categoryId?: string, search?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        type: import(".prisma/client").$Enums.ServiceTypeEnum;
        slug: string;
        shortDescription: string;
        fullDescription: string | null;
        iconUrl: string | null;
        basePrice: number;
        categoryId: string | null;
        seoPageId: string | null;
    }[]>;
    getServiceBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        type: import(".prisma/client").$Enums.ServiceTypeEnum;
        slug: string;
        shortDescription: string;
        fullDescription: string | null;
        iconUrl: string | null;
        basePrice: number;
        categoryId: string | null;
        seoPageId: string | null;
    }>;
    createService(dto: CreateServiceDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        type: import(".prisma/client").$Enums.ServiceTypeEnum;
        slug: string;
        shortDescription: string;
        fullDescription: string | null;
        iconUrl: string | null;
        basePrice: number;
        categoryId: string | null;
        seoPageId: string | null;
    }>;
    updateService(id: string, dto: UpdateServiceDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        type: import(".prisma/client").$Enums.ServiceTypeEnum;
        slug: string;
        shortDescription: string;
        fullDescription: string | null;
        iconUrl: string | null;
        basePrice: number;
        categoryId: string | null;
        seoPageId: string | null;
    }>;
    deleteService(id: string, user: JwtPayload): Promise<{
        success: boolean;
    }>;
    createCategory(dto: CreateServiceCategoryDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
        slug: string;
        sortOrder: number;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    addFeature(dto: CreateServiceFeatureDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        serviceId: string;
        isIncluded: boolean;
    }>;
    deleteFeature(id: string): Promise<{
        success: boolean;
    }>;
    addFaq(dto: CreateServiceFaqDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        serviceId: string;
        question: string;
        answer: string;
    }>;
    deleteFaq(id: string): Promise<{
        success: boolean;
    }>;
}

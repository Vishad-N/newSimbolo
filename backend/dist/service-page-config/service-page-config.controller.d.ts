import { ServicePageConfigService } from './service-page-config.service';
import { ServicePageConfigDto } from './dto/service-page-config.dto';
export declare class ServicePageConfigController {
    private readonly configService;
    constructor(configService: ServicePageConfigService);
    getConfig(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: string;
        heroBenefits: import("@prisma/client/runtime/library").JsonValue | null;
        statsBar: import("@prisma/client/runtime/library").JsonValue | null;
        servicesList: import("@prisma/client/runtime/library").JsonValue | null;
        resultMetrics: import("@prisma/client/runtime/library").JsonValue | null;
    } | null>;
    updateConfig(slug: string, dto: ServicePageConfigDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: string;
        heroBenefits: import("@prisma/client/runtime/library").JsonValue | null;
        statsBar: import("@prisma/client/runtime/library").JsonValue | null;
        servicesList: import("@prisma/client/runtime/library").JsonValue | null;
        resultMetrics: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}

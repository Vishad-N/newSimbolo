import { PrismaService } from '../prisma/prisma.service';
import { ServicePageConfigDto } from './dto/service-page-config.dto';
import { Prisma } from '@prisma/client';
export declare class ServicePageConfigService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByServiceSlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: string;
        heroBenefits: Prisma.JsonValue | null;
        statsBar: Prisma.JsonValue | null;
        servicesList: Prisma.JsonValue | null;
        resultMetrics: Prisma.JsonValue | null;
    } | null>;
    upsert(slug: string, dto: ServicePageConfigDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serviceId: string;
        heroBenefits: Prisma.JsonValue | null;
        statsBar: Prisma.JsonValue | null;
        servicesList: Prisma.JsonValue | null;
        resultMetrics: Prisma.JsonValue | null;
    }>;
}

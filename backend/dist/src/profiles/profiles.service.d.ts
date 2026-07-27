import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AuditService } from '../shared/audit/audit.service';
import { UpdateClientProfileDto } from './dto/update-client-profile.dto';
export declare class ProfilesService extends BaseService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    getClientProfile(userId: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            slug: string;
            website: string | null;
            industry: string | null;
            size: string | null;
            logoUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        agencyId: string | null;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        gstNumber: string | null;
        billingAddress: string | null;
        timezone: string;
        companyId: string | null;
    }>;
    updateClientProfile(userId: string, dto: UpdateClientProfileDto): Promise<{
        company: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            slug: string;
            website: string | null;
            industry: string | null;
            size: string | null;
            logoUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        agencyId: string | null;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        gstNumber: string | null;
        billingAddress: string | null;
        timezone: string;
        companyId: string | null;
    }>;
}

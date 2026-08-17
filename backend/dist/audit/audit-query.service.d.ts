import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AuditQueryDto } from './dto/audit-query.dto';
export declare class AuditQueryService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: AuditQueryDto): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            action: string;
            entityType: string;
            entityId: string;
            oldValue: string | null;
            newValue: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
            userId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    summary(query: AuditQueryDto): Promise<{
        byEntityType: {
            entityType: string;
            count: number;
        }[];
        byAction: {
            action: string;
            count: number;
        }[];
    }>;
}

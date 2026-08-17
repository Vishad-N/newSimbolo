import { AuditQueryService } from './audit-query.service';
import { AuditQueryDto } from './dto/audit-query.dto';
export declare class AuditController {
    private readonly auditQueryService;
    constructor(auditQueryService: AuditQueryService);
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

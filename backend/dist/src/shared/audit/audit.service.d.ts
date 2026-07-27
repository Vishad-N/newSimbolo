import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../abstractions/base.service';
export interface LogAuditDto {
    action: string;
    entityType: string;
    entityId: string;
    oldValue?: Record<string, any> | string;
    newValue?: Record<string, any> | string;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
}
export declare class AuditService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logEvent(dto: LogAuditDto): Promise<void>;
    getLogsByEntity(entityType: string, entityId: string, limit?: number): Promise<({
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
    })[]>;
    getLogsByUser(userId: string, limit?: number): Promise<{
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
    }[]>;
}

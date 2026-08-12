import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
export declare class SessionsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSession(userId: string, sessionToken: string, expiresAt: Date, ipAddress?: string, userAgent?: string): Promise<{
        id: string;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        sessionToken: string;
        expiresAt: Date;
    }>;
    findByToken(sessionToken: string): Promise<{
        id: string;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        sessionToken: string;
        expiresAt: Date;
    } | null>;
    getUserSessions(userId: string): Promise<{
        id: string;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date;
    }[]>;
    touchSession(sessionToken: string): Promise<void>;
    terminateSession(userId: string, sessionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    terminateAllSessions(userId: string, currentSessionToken?: string): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
    cleanupExpiredSessions(): Promise<number>;
}

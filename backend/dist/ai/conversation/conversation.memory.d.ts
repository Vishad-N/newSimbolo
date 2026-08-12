import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../prisma/prisma.service';
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    intentDetected?: string;
    createdAt?: string;
}
export interface SessionMemoryData {
    sessionId: string;
    userId?: string;
    history: ChatMessage[];
    metadata: {
        budget?: string;
        industry?: string;
        preferredServices?: string[];
        goals?: string[];
        [key: string]: any;
    };
}
export declare class SessionMemory {
    private readonly cacheService;
    private readonly prisma;
    private readonly logger;
    constructor(cacheService: CacheService, prisma: PrismaService);
    getSession(sessionId: string, userId?: string): Promise<SessionMemoryData>;
    saveSessionToCache(session: SessionMemoryData): Promise<void>;
    appendMessage(sessionId: string, message: ChatMessage, metadataUpdates?: Record<string, any>): Promise<SessionMemoryData>;
    updateMetadata(sessionId: string, metadataUpdates: Record<string, any>): Promise<void>;
    private persistSession;
}

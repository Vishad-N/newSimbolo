"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SessionMemory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMemory = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../../cache/cache.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let SessionMemory = SessionMemory_1 = class SessionMemory {
    cacheService;
    prisma;
    logger = new common_1.Logger(SessionMemory_1.name);
    constructor(cacheService, prisma) {
        this.cacheService = cacheService;
        this.prisma = prisma;
    }
    async getSession(sessionId, userId) {
        const cacheKey = `ai:session:${sessionId}`;
        let session = await this.cacheService.get(cacheKey);
        if (!session) {
            const dbConversation = await this.prisma.aiConversation.findFirst({
                where: { sessionId },
                include: { messages: { orderBy: { createdAt: 'asc' } } },
            });
            if (dbConversation) {
                session = {
                    sessionId: dbConversation.sessionId,
                    userId: dbConversation.userId || userId,
                    history: dbConversation.messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                        intentDetected: m.intentDetected || undefined,
                        createdAt: m.createdAt.toISOString(),
                    })),
                    metadata: dbConversation.metadata || {},
                };
            }
            else {
                session = {
                    sessionId,
                    userId,
                    history: [],
                    metadata: {},
                };
            }
            await this.saveSessionToCache(session);
        }
        if (userId && session.userId !== userId) {
            session.userId = userId;
            await this.saveSessionToCache(session);
        }
        return session;
    }
    async saveSessionToCache(session) {
        const cacheKey = `ai:session:${session.sessionId}`;
        await this.cacheService.set(cacheKey, session, 86400); // 24 hours
    }
    async appendMessage(sessionId, message, metadataUpdates) {
        const session = await this.getSession(sessionId);
        session.history.push(message);
        if (metadataUpdates) {
            session.metadata = { ...session.metadata, ...metadataUpdates };
        }
        await this.saveSessionToCache(session);
        this.persistSession(session).catch((e) => {
            this.logger.error(`Failed to persist session to DB: ${e.message}`);
        });
        return session;
    }
    async updateMetadata(sessionId, metadataUpdates) {
        const session = await this.getSession(sessionId);
        session.metadata = { ...session.metadata, ...metadataUpdates };
        await this.saveSessionToCache(session);
        this.persistSession(session).catch(() => { });
    }
    async persistSession(session) {
        let dbConversation = await this.prisma.aiConversation.findFirst({
            where: { sessionId: session.sessionId },
        });
        if (!dbConversation) {
            dbConversation = await this.prisma.aiConversation.create({
                data: {
                    sessionId: session.sessionId,
                    userId: session.userId,
                    metadata: session.metadata,
                    title: 'AI Consultation',
                },
            });
        }
        else {
            dbConversation = await this.prisma.aiConversation.update({
                where: { id: dbConversation.id },
                data: {
                    userId: session.userId,
                    metadata: session.metadata,
                },
            });
        }
        const lastMessage = session.history[session.history.length - 1];
        if (lastMessage && !lastMessage.createdAt) {
            // Only insert if not already from DB
            await this.prisma.aiMessage.create({
                data: {
                    conversationId: dbConversation.id,
                    role: lastMessage.role,
                    content: lastMessage.content,
                    intentDetected: lastMessage.intentDetected,
                },
            });
            lastMessage.createdAt = new Date().toISOString(); // mark as persisted
        }
    }
};
exports.SessionMemory = SessionMemory;
exports.SessionMemory = SessionMemory = SessionMemory_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        prisma_service_1.PrismaService])
], SessionMemory);
//# sourceMappingURL=conversation.memory.js.map
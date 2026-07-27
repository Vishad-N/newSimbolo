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
var SessionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let SessionsService = SessionsService_1 = class SessionsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super(SessionsService_1.name);
        this.prisma = prisma;
    }
    async createSession(userId, sessionToken, expiresAt, ipAddress, userAgent) {
        this.logger.debug(`Creating new session for user ${userId}`);
        return this.prisma.session.create({
            data: {
                userId,
                sessionToken,
                expiresAt,
                ipAddress,
                userAgent,
            },
        });
    }
    async findByToken(sessionToken) {
        return this.prisma.session.findUnique({
            where: { sessionToken },
        });
    }
    async getUserSessions(userId) {
        this.logger.debug(`Retrieving active sessions for user ${userId}`);
        const now = new Date();
        return this.prisma.session.findMany({
            where: {
                userId,
                expiresAt: { gt: now },
            },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                ipAddress: true,
                userAgent: true,
                createdAt: true,
                updatedAt: true,
                expiresAt: true,
            },
        });
    }
    async touchSession(sessionToken) {
        try {
            await this.prisma.session.update({
                where: { sessionToken },
                data: { updatedAt: new Date() },
            });
        }
        catch (error) {
            // Ignore if session was removed or expired
        }
    }
    async terminateSession(userId, sessionId) {
        this.logger.debug(`Terminating session ${sessionId} for user ${userId}`);
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            return { success: true, message: 'Session already terminated or not found' };
        }
        if (session.userId !== userId) {
            throw new custom_exceptions_1.CustomForbiddenException('You do not have permission to terminate this session');
        }
        await this.prisma.session.delete({
            where: { id: sessionId },
        });
        return { success: true, message: 'Session terminated successfully' };
    }
    async terminateAllSessions(userId, currentSessionToken) {
        this.logger.debug(`Terminating all sessions for user ${userId} (except current: ${!!currentSessionToken})`);
        const whereClause = { userId };
        if (currentSessionToken) {
            whereClause.sessionToken = { not: currentSessionToken };
        }
        const result = await this.prisma.session.deleteMany({
            where: whereClause,
        });
        return {
            success: true,
            count: result.count,
            message: `Terminated ${result.count} active session(s)`,
        };
    }
    async cleanupExpiredSessions() {
        const now = new Date();
        const result = await this.prisma.session.deleteMany({
            where: { expiresAt: { lte: now } },
        });
        if (result.count > 0) {
            this.logger.log(`🧹 Purged ${result.count} expired sessions`);
        }
        return result.count;
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = SessionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map
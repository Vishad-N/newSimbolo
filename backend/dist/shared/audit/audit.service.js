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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_service_1 = require("../abstractions/base.service");
let AuditService = AuditService_1 = class AuditService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super(AuditService_1.name);
        this.prisma = prisma;
    }
    async logEvent(dto) {
        try {
            const oldValueStr = typeof dto.oldValue === 'object' ? JSON.stringify(dto.oldValue) : dto.oldValue;
            const newValueStr = typeof dto.newValue === 'object' ? JSON.stringify(dto.newValue) : dto.newValue;
            await this.prisma.auditLog.create({
                data: {
                    action: dto.action,
                    entityType: dto.entityType,
                    entityId: dto.entityId,
                    oldValue: oldValueStr,
                    newValue: newValueStr,
                    ipAddress: dto.ipAddress,
                    userAgent: dto.userAgent,
                    userId: dto.userId,
                },
            });
            this.logger.debug(`🔒 [AUDIT] Action: ${dto.action} | Entity: ${dto.entityType} (${dto.entityId}) | User: ${dto.userId || 'System'}`);
        }
        catch (error) {
            this.logger.error(`Failed to create audit log entry for action "${dto.action}":`, error.stack);
        }
    }
    async getLogsByEntity(entityType, entityId, limit = 50) {
        return this.prisma.auditLog.findMany({
            where: { entityType, entityId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true },
                },
            },
        });
    }
    async getLogsByUser(userId, limit = 50) {
        return this.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map
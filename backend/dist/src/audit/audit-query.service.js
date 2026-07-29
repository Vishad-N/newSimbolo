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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditQueryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
let AuditQueryService = class AuditQueryService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('AuditQueryService');
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {
            ...(query.action ? { action: { contains: query.action, mode: 'insensitive' } } : {}),
            ...(query.entityType ? { entityType: query.entityType } : {}),
            ...(query.entityId ? { entityId: query.entityId } : {}),
            ...(query.userId ? { userId: query.userId } : {}),
            ...(query.startDate || query.endDate
                ? {
                    createdAt: {
                        ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
                        ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
                    },
                }
                : {}),
        };
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async summary(query) {
        const data = await this.findAll({ ...query, page: 1, limit: 100 });
        const byEntity = new Map();
        const byAction = new Map();
        for (const log of data.data) {
            byEntity.set(log.entityType, (byEntity.get(log.entityType) ?? 0) + 1);
            byAction.set(log.action, (byAction.get(log.action) ?? 0) + 1);
        }
        return {
            byEntityType: Array.from(byEntity.entries()).map(([entityType, count]) => ({ entityType, count })),
            byAction: Array.from(byAction.entries()).map(([action, count]) => ({ action, count })),
        };
    }
};
exports.AuditQueryService = AuditQueryService;
exports.AuditQueryService = AuditQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditQueryService);
//# sourceMappingURL=audit-query.service.js.map
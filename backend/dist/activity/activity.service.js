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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
let ActivityService = class ActivityService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('ActivityService');
        this.prisma = prisma;
    }
    async getGlobalFeed(filters) {
        const { eventType, startDate, endDate, page = 1, limit = 50 } = filters;
        const where = {};
        if (eventType)
            where.eventType = eventType;
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = startDate;
            if (endDate)
                where.date.lte = endDate;
        }
        const [data, total] = await Promise.all([
            this.prisma.timeline.findMany({
                where,
                include: {
                    project: { select: { id: true, name: true } },
                    client: { include: { user: { select: { firstName: true, lastName: true } } } },
                    order: { select: { orderNumber: true } },
                    user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: 'desc' },
            }),
            this.prisma.timeline.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async getProjectActivity(projectId, page = 1, limit = 50) {
        const where = { projectId };
        const [data, total] = await Promise.all([
            this.prisma.timeline.findMany({
                where,
                include: {
                    user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
                    deliverable: { select: { id: true, title: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: 'desc' },
            }),
            this.prisma.timeline.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async getClientActivity(clientId, page = 1, limit = 50) {
        const where = { clientId };
        const [data, total] = await Promise.all([
            this.prisma.timeline.findMany({
                where,
                include: {
                    project: { select: { id: true, name: true } },
                    order: { select: { orderNumber: true, status: true } },
                    user: { select: { id: true, firstName: true, lastName: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: 'desc' },
            }),
            this.prisma.timeline.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async recordActivity(data) {
        return this.prisma.timeline.create({
            data: {
                title: data.title,
                description: data.description ?? null,
                eventType: data.eventType,
                projectId: data.projectId ?? null,
                clientId: data.clientId ?? null,
                orderId: data.orderId ?? null,
                ticketId: data.ticketId ?? null,
                meetingId: data.meetingId ?? null,
                deliverableId: data.deliverableId ?? null,
                userId: data.userId ?? null,
                metadata: data.metadata ? JSON.stringify(data.metadata) : null,
            },
        });
    }
    async getEventTypes() {
        const events = await this.prisma.timeline.findMany({
            distinct: ['eventType'],
            select: { eventType: true },
        });
        return { eventTypes: events.map((e) => e.eventType) };
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivityService);
//# sourceMappingURL=activity.service.js.map
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
exports.InsightsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const insight_dto_1 = require("./dto/insight.dto");
let InsightsService = class InsightsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('InsightsService');
        this.prisma = prisma;
    }
    async generateInsights() {
        const [packageRevenue, serviceOrders, longRunningProjects, overloadedMembers, delayedPayments, popularBlogs] = await Promise.all([
            this.prisma.order.groupBy({
                by: ['packageId'],
                where: { deletedAt: null, packageId: { not: null }, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
                _sum: { netAmount: true },
                _count: true,
                orderBy: { _sum: { netAmount: 'desc' } },
                take: 5,
            }),
            this.prisma.order.groupBy({
                by: ['serviceId'],
                where: { deletedAt: null, serviceId: { not: null } },
                _count: true,
                orderBy: { _count: { serviceId: 'desc' } },
                take: 5,
            }),
            this.prisma.project.findMany({
                where: {
                    deletedAt: null,
                    status: { in: ['ACTIVE', 'IN_PROGRESS', 'ON_HOLD'] },
                    targetEndDate: { lt: new Date() },
                },
                select: { id: true, name: true, targetEndDate: true },
                take: 10,
            }),
            this.prisma.task.groupBy({
                by: ['assignedToId'],
                where: { assignedToId: { not: null }, status: { not: 'COMPLETED' } },
                _count: true,
                having: { assignedToId: { _count: { gt: 10 } } },
            }),
            this.prisma.invoice.findMany({
                where: { deletedAt: null, status: 'OVERDUE' },
                select: { id: true, invoiceNumber: true, totalAmount: true, dueDate: true },
                orderBy: { dueDate: 'asc' },
                take: 10,
            }),
            this.prisma.blog.findMany({
                where: { deletedAt: null, status: 'PUBLISHED' },
                select: { id: true, title: true, readingTimeMin: true, publishDate: true },
                orderBy: { publishDate: 'desc' },
                take: 5,
            }),
        ]);
        const insights = [];
        if (packageRevenue[0]) {
            insights.push({
                id: 'most-profitable-package',
                category: insight_dto_1.InsightCategory.REVENUE,
                title: 'Most Profitable Package Identified',
                description: `Top package generated ${packageRevenue[0]._sum.netAmount ?? 0} from ${packageRevenue[0]._count} orders.`,
                severity: 'LOW',
                metric: packageRevenue[0]._sum.netAmount ?? 0,
                generatedAt: new Date().toISOString(),
            });
        }
        if (serviceOrders[0]) {
            insights.push({
                id: 'frequently-requested-service',
                category: insight_dto_1.InsightCategory.SERVICE,
                title: 'Frequently Requested Service',
                description: `A leading service has ${serviceOrders[0]._count} associated orders. Consider promoting adjacent packages.`,
                severity: 'LOW',
                metric: serviceOrders[0]._count,
                generatedAt: new Date().toISOString(),
            });
        }
        for (const project of longRunningProjects) {
            insights.push({
                id: `long-running-project-${project.id}`,
                category: insight_dto_1.InsightCategory.PROJECT,
                title: 'Long-Running Project Risk',
                description: `${project.name} is past its target end date.`,
                severity: 'HIGH',
                generatedAt: new Date().toISOString(),
            });
        }
        for (const member of overloadedMembers) {
            insights.push({
                id: `overloaded-member-${member.assignedToId}`,
                category: insight_dto_1.InsightCategory.TEAM,
                title: 'Overloaded Team Member',
                description: `A team member has ${member._count} open tasks assigned.`,
                severity: 'MEDIUM',
                metric: member._count,
                generatedAt: new Date().toISOString(),
            });
        }
        for (const invoice of delayedPayments) {
            insights.push({
                id: `payment-delay-${invoice.id}`,
                category: insight_dto_1.InsightCategory.PAYMENT,
                title: 'Payment Delay',
                description: `Invoice ${invoice.invoiceNumber} is overdue with amount ${invoice.totalAmount}.`,
                severity: 'HIGH',
                metric: invoice.totalAmount,
                generatedAt: new Date().toISOString(),
            });
        }
        for (const blog of popularBlogs) {
            insights.push({
                id: `popular-topic-${blog.id}`,
                category: insight_dto_1.InsightCategory.CONTENT,
                title: 'Recent Blog Topic Opportunity',
                description: `${blog.title} can be repurposed into social posts, FAQs, and email content.`,
                severity: 'LOW',
                metric: blog.readingTimeMin,
                generatedAt: new Date().toISOString(),
            });
        }
        await Promise.all(insights.map((insight) => this.prisma.globalSetting.upsert({
            where: { key: `insight:${insight.id}` },
            create: {
                key: `insight:${insight.id}`,
                value: JSON.stringify(insight),
                category: 'AI_INSIGHT',
                description: insight.title,
                isPublic: false,
            },
            update: {
                value: JSON.stringify(insight),
                description: insight.title,
            },
        })));
        return insights;
    }
    async findInsights(query = {}) {
        const records = await this.prisma.globalSetting.findMany({
            where: { category: 'AI_INSIGHT' },
            orderBy: { updatedAt: 'desc' },
        });
        const insights = records
            .map((record) => JSON.parse(record.value))
            .filter((insight) => (query.category ? insight.category === query.category : true));
        return { data: insights, meta: { total: insights.length } };
    }
};
exports.InsightsService = InsightsService;
exports.InsightsService = InsightsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InsightsService);
//# sourceMappingURL=insights.service.js.map
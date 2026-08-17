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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const report_dto_1 = require("./dto/report.dto");
let ReportsService = class ReportsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('ReportsService');
        this.prisma = prisma;
    }
    createdAtWhere(dto) {
        if (!dto.startDate && !dto.endDate)
            return {};
        return {
            createdAt: {
                ...(dto.startDate ? { gte: new Date(dto.startDate) } : {}),
                ...(dto.endDate ? { lte: new Date(dto.endDate) } : {}),
            },
        };
    }
    async generate(dto) {
        switch (dto.type) {
            case report_dto_1.ReportType.REVENUE:
                return this.generateRevenueReport(dto);
            case report_dto_1.ReportType.CLIENTS:
                return this.generateClientsReport(dto);
            case report_dto_1.ReportType.PROJECTS:
                return this.generateProjectsReport(dto);
            case report_dto_1.ReportType.ORDERS:
                return this.generateOrdersReport(dto);
            case report_dto_1.ReportType.PAYMENTS:
                return this.generatePaymentsReport(dto);
            case report_dto_1.ReportType.TEAM_PERFORMANCE:
                return this.generateTeamReport(dto);
            case report_dto_1.ReportType.MARKETING_PERFORMANCE:
                return this.generateMarketingReport(dto);
            case report_dto_1.ReportType.SUPPORT_TICKETS:
                return this.generateSupportReport(dto);
            case report_dto_1.ReportType.CONTENT_PERFORMANCE:
                return this.generateContentReport(dto);
            case report_dto_1.ReportType.WEBSITE_ANALYTICS:
                return this.generateWebsiteReport(dto);
            default:
                throw new common_1.BadRequestException('Unsupported report type');
        }
    }
    buildReport(type, title, dto, columns, rows, totals) {
        return {
            type,
            title,
            generatedAt: new Date().toISOString(),
            filtersApplied: {
                startDate: dto.startDate,
                endDate: dto.endDate,
                groupBy: dto.groupBy,
                sortBy: dto.sortBy,
                sortDirection: dto.sortDirection,
                ...(dto.filters ?? {}),
            },
            columns,
            rows,
            totals,
        };
    }
    async generateRevenueReport(dto) {
        const rows = await this.prisma.payment.findMany({
            where: { status: 'SUCCESSFUL', ...this.createdAtWhere(dto) },
            select: {
                paymentNumber: true,
                amount: true,
                currency: true,
                gatewayProvider: true,
                paidAt: true,
                order: { select: { orderNumber: true } },
            },
            orderBy: { paidAt: 'desc' },
        });
        const reportRows = rows.map((row) => ({
            paymentNumber: row.paymentNumber,
            orderNumber: row.order?.orderNumber ?? null,
            amount: row.amount,
            currency: row.currency,
            gatewayProvider: row.gatewayProvider,
            paidAt: row.paidAt?.toISOString() ?? null,
        }));
        return this.buildReport(report_dto_1.ReportType.REVENUE, 'Revenue Report', dto, ['paymentNumber', 'orderNumber', 'amount', 'currency', 'gatewayProvider', 'paidAt'], reportRows, { totalRevenue: rows.reduce((sum, row) => sum + row.amount, 0), totalPayments: rows.length });
    }
    async generateClientsReport(dto) {
        const rows = await this.prisma.clientProfile.findMany({
            where: { deletedAt: null, ...this.createdAtWhere(dto) },
            select: {
                id: true,
                status: true,
                createdAt: true,
                user: { select: { firstName: true, lastName: true, email: true } },
                company: { select: { name: true, industry: true } },
                _count: { select: { orders: true, projects: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return this.buildReport(report_dto_1.ReportType.CLIENTS, 'Clients Report', dto, ['clientId', 'name', 'email', 'company', 'industry', 'status', 'orders', 'projects', 'createdAt'], rows.map((row) => ({
            clientId: row.id,
            name: `${row.user.firstName} ${row.user.lastName}`,
            email: row.user.email,
            company: row.company?.name ?? null,
            industry: row.company?.industry ?? null,
            status: row.status,
            orders: row._count.orders,
            projects: row._count.projects,
            createdAt: row.createdAt.toISOString(),
        })), { totalClients: rows.length });
    }
    async generateProjectsReport(dto) {
        const rows = await this.prisma.project.findMany({
            where: { deletedAt: null, ...this.createdAtWhere(dto) },
            select: { id: true, name: true, status: true, priority: true, progress: true, budget: true, createdAt: true },
            orderBy: { updatedAt: 'desc' },
        });
        return this.buildReport(report_dto_1.ReportType.PROJECTS, 'Projects Report', dto, ['projectId', 'name', 'status', 'priority', 'progress', 'budget', 'createdAt'], rows.map((row) => ({
            projectId: row.id,
            name: row.name,
            status: row.status,
            priority: row.priority,
            progress: row.progress,
            budget: row.budget ?? 0,
            createdAt: row.createdAt.toISOString(),
        })), { totalProjects: rows.length, totalBudget: rows.reduce((sum, row) => sum + (row.budget ?? 0), 0) });
    }
    async generateOrdersReport(dto) {
        const rows = await this.prisma.order.findMany({
            where: { deletedAt: null, ...this.createdAtWhere(dto) },
            select: { orderNumber: true, status: true, netAmount: true, currency: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
        return this.buildReport(report_dto_1.ReportType.ORDERS, 'Orders Report', dto, ['orderNumber', 'status', 'netAmount', 'currency', 'createdAt'], rows.map((row) => ({
            orderNumber: row.orderNumber,
            status: row.status,
            netAmount: row.netAmount,
            currency: row.currency,
            createdAt: row.createdAt.toISOString(),
        })), { totalOrders: rows.length, totalValue: rows.reduce((sum, row) => sum + row.netAmount, 0) });
    }
    async generatePaymentsReport(dto) {
        const rows = await this.prisma.payment.findMany({
            where: this.createdAtWhere(dto),
            select: {
                paymentNumber: true,
                status: true,
                amount: true,
                currency: true,
                gatewayProvider: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return this.buildReport(report_dto_1.ReportType.PAYMENTS, 'Payments Report', dto, ['paymentNumber', 'status', 'amount', 'currency', 'gatewayProvider', 'createdAt'], rows.map((row) => ({
            paymentNumber: row.paymentNumber,
            status: row.status,
            amount: row.amount,
            currency: row.currency,
            gatewayProvider: row.gatewayProvider,
            createdAt: row.createdAt.toISOString(),
        })), { totalPayments: rows.length, totalAmount: rows.reduce((sum, row) => sum + row.amount, 0) });
    }
    async generateTeamReport(dto) {
        const rows = await this.prisma.task.groupBy({
            by: ['assignedToId'],
            where: { assignedToId: { not: null }, ...this.createdAtWhere(dto) },
            _count: true,
            _sum: { estimatedHours: true, actualHours: true },
        });
        const users = await this.prisma.user.findMany({
            where: { id: { in: rows.map((row) => row.assignedToId).filter((id) => Boolean(id)) } },
            select: { id: true, firstName: true, lastName: true, email: true },
        });
        return this.buildReport(report_dto_1.ReportType.TEAM_PERFORMANCE, 'Team Performance Report', dto, ['userId', 'name', 'email', 'tasks', 'estimatedHours', 'actualHours'], rows.map((row) => {
            const user = users.find((record) => record.id === row.assignedToId);
            return {
                userId: row.assignedToId,
                name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
                email: user?.email ?? null,
                tasks: row._count,
                estimatedHours: row._sum.estimatedHours ?? 0,
                actualHours: row._sum.actualHours ?? 0,
            };
        }), { totalAssignedTasks: rows.reduce((sum, row) => sum + row._count, 0) });
    }
    async generateMarketingReport(dto) {
        const rows = await this.prisma.eventLog.groupBy({
            by: ['eventName', 'eventCategory'],
            where: dto.startDate || dto.endDate ? { timestamp: this.createdAtWhere(dto).createdAt } : {},
            _count: true,
        });
        return this.buildReport(report_dto_1.ReportType.MARKETING_PERFORMANCE, 'Marketing Performance Report', dto, ['eventName', 'eventCategory', 'count'], rows.map((row) => ({ eventName: row.eventName, eventCategory: row.eventCategory, count: row._count })), { totalEvents: rows.reduce((sum, row) => sum + row._count, 0) });
    }
    async generateSupportReport(dto) {
        const rows = await this.prisma.supportTicket.findMany({
            where: { deletedAt: null, ...this.createdAtWhere(dto) },
            select: {
                ticketNumber: true,
                subject: true,
                status: true,
                priority: true,
                category: true,
                createdAt: true,
                closedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return this.buildReport(report_dto_1.ReportType.SUPPORT_TICKETS, 'Support Tickets Report', dto, ['ticketNumber', 'subject', 'status', 'priority', 'category', 'createdAt', 'closedAt'], rows.map((row) => ({
            ticketNumber: row.ticketNumber,
            subject: row.subject,
            status: row.status,
            priority: row.priority,
            category: row.category ?? null,
            createdAt: row.createdAt.toISOString(),
            closedAt: row.closedAt?.toISOString() ?? null,
        })), { totalTickets: rows.length });
    }
    async generateContentReport(dto) {
        const [blogs, caseStudies] = await Promise.all([
            this.prisma.blog.groupBy({
                by: ['status'],
                where: { deletedAt: null, ...this.createdAtWhere(dto) },
                _count: true,
            }),
            this.prisma.caseStudy.groupBy({
                by: ['status'],
                where: { deletedAt: null, ...this.createdAtWhere(dto) },
                _count: true,
            }),
        ]);
        const rows = [
            ...blogs.map((row) => ({ contentType: 'Blog', status: row.status, count: row._count })),
            ...caseStudies.map((row) => ({ contentType: 'Case Study', status: row.status, count: row._count })),
        ];
        return this.buildReport(report_dto_1.ReportType.CONTENT_PERFORMANCE, 'Content Performance Report', dto, ['contentType', 'status', 'count'], rows, { totalContentItems: rows.reduce((sum, row) => sum + Number(row.count), 0) });
    }
    async generateWebsiteReport(dto) {
        const rows = await this.prisma.pageView.groupBy({
            by: ['path', 'deviceType'],
            where: dto.startDate || dto.endDate ? { timestamp: this.createdAtWhere(dto).createdAt } : {},
            _count: true,
        });
        return this.buildReport(report_dto_1.ReportType.WEBSITE_ANALYTICS, 'Website Analytics Report', dto, ['path', 'deviceType', 'views'], rows.map((row) => ({ path: row.path, deviceType: row.deviceType ?? 'unknown', views: row._count })), { totalViews: rows.reduce((sum, row) => sum + row._count, 0) });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
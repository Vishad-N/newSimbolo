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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
let DashboardService = class DashboardService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('DashboardService');
        this.prisma = prisma;
    }
    async getAdminOverview() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalClients, activeProjects, openTickets, pendingDeliverables, upcomingMeetings, monthlyOrders, projectsByStatus, recentActivity,] = await Promise.all([
            this.prisma.clientProfile.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
            this.prisma.project.count({ where: { deletedAt: null, status: { in: ['ACTIVE', 'IN_PROGRESS', 'PLANNING'] } } }),
            this.prisma.supportTicket.count({ where: { deletedAt: null, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
            this.prisma.deliverable.count({ where: { deletedAt: null, status: { in: ['PENDING', 'SUBMITTED'] } } }),
            this.prisma.meeting.count({ where: { deletedAt: null, startTime: { gte: now } } }),
            this.prisma.order.findMany({
                where: { deletedAt: null, createdAt: { gte: monthStart } },
                select: { netAmount: true, status: true, currency: true },
            }),
            this.prisma.project.groupBy({
                by: ['status'],
                _count: true,
                where: { deletedAt: null },
            }),
            this.prisma.timeline.findMany({
                orderBy: { date: 'desc' },
                take: 20,
                include: {
                    project: { select: { id: true, name: true } },
                    client: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
                    user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
                },
            }),
        ]);
        const monthlyRevenue = monthlyOrders
            .filter((o) => !['CANCELLED', 'REFUNDED'].includes(o.status))
            .reduce((sum, o) => sum + o.netAmount, 0);
        return {
            metrics: {
                totalClients,
                activeProjects,
                openTickets,
                pendingDeliverables,
                upcomingMeetings,
                monthlyRevenue,
            },
            projectsByStatus: projectsByStatus.map((p) => ({ status: p.status, count: p._count })),
            recentActivity,
        };
    }
    async getClientDashboard(clientId) {
        const now = new Date();
        const [activeProjects, pendingDeliverables, upcomingMeetings, openTickets, recentActivity, projects] = await Promise.all([
            this.prisma.project.count({
                where: { clientId, deletedAt: null, status: { in: ['PLANNING', 'ACTIVE', 'IN_PROGRESS'] } },
            }),
            this.prisma.deliverable.count({
                where: { project: { clientId }, deletedAt: null, status: { in: ['PENDING', 'SUBMITTED'] } },
            }),
            this.prisma.meeting.count({ where: { clientId, deletedAt: null, startTime: { gte: now } } }),
            this.prisma.supportTicket.count({
                where: { clientId, deletedAt: null, status: { in: ['OPEN', 'IN_PROGRESS'] } },
            }),
            this.prisma.timeline.findMany({
                where: { clientId },
                orderBy: { date: 'desc' },
                take: 15,
            }),
            this.prisma.project.findMany({
                where: { clientId, deletedAt: null, status: { notIn: ['COMPLETED', 'CANCELLED'] } },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    progress: true,
                    targetEndDate: true,
                    _count: { select: { tasks: true, deliverables: true } },
                },
                orderBy: { updatedAt: 'desc' },
                take: 5,
            }),
        ]);
        return {
            metrics: { activeProjects, pendingDeliverables, upcomingMeetings, openTickets },
            projects,
            recentActivity,
        };
    }
    async getProjectStats(projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, deletedAt: null },
            include: {
                milestones: { orderBy: { sortOrder: 'asc' } },
                _count: { select: { tasks: true, deliverables: true, teamMembers: true } },
            },
        });
        if (!project)
            return null;
        const tasksByStatus = await this.prisma.task.groupBy({
            by: ['status'],
            _count: true,
            where: { projectId },
        });
        const deliverablesByStatus = await this.prisma.deliverable.groupBy({
            by: ['status'],
            _count: true,
            where: { projectId, deletedAt: null },
        });
        const completedMilestones = project.milestones.filter((m) => m.status === 'COMPLETED').length;
        return {
            project: {
                id: project.id,
                name: project.name,
                status: project.status,
                progress: project.progress,
                priority: project.priority,
            },
            counts: project._count,
            tasksByStatus: tasksByStatus.map((t) => ({ status: t.status, count: t._count })),
            deliverablesByStatus: deliverablesByStatus.map((d) => ({ status: d.status, count: d._count })),
            milestoneProgress: {
                total: project.milestones.length,
                completed: completedMilestones,
                percentage: project.milestones.length > 0 ? Math.round((completedMilestones / project.milestones.length) * 100) : 0,
            },
        };
    }
    // ── Phase 8: Admin Revenue & Billing ───────────────────────────────
    async getAdminRevenueOverview() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const [currentMonthPayments, lastMonthPayments, totalRevenue, pendingInvoicesCount, activeSubscriptionsCount, recentPayments,] = await Promise.all([
            this.prisma.payment.aggregate({
                where: { status: 'SUCCESSFUL', paidAt: { gte: monthStart } },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.payment.aggregate({
                where: { status: 'SUCCESSFUL', paidAt: { gte: lastMonthStart, lte: lastMonthEnd } },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.payment.aggregate({
                where: { status: 'SUCCESSFUL' },
                _sum: { amount: true },
            }),
            this.prisma.invoice.count({ where: { status: { in: ['SENT', 'OVERDUE'] }, deletedAt: null } }),
            this.prisma.subscription.count({ where: { status: 'ACTIVE', deletedAt: null } }),
            this.prisma.payment.findMany({
                where: { status: 'SUCCESSFUL' },
                include: {
                    order: {
                        select: {
                            orderNumber: true,
                            client: { include: { user: { select: { firstName: true, lastName: true } } } },
                        },
                    },
                },
                orderBy: { paidAt: 'desc' },
                take: 10,
            }),
        ]);
        const currentRevenue = currentMonthPayments._sum.amount ?? 0;
        const lastRevenue = lastMonthPayments._sum.amount ?? 0;
        const growthPct = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
        return {
            revenue: {
                currentMonth: currentRevenue,
                lastMonth: lastRevenue,
                growthPercentage: parseFloat(growthPct.toFixed(2)),
                totalAllTime: totalRevenue._sum.amount ?? 0,
            },
            counts: {
                currentMonthPayments: currentMonthPayments._count,
                pendingInvoices: pendingInvoicesCount,
                activeSubscriptions: activeSubscriptionsCount,
            },
            recentPayments,
        };
    }
    async getAdminPaymentAnalytics(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const [byStatus, byProvider, dailyRevenue] = await Promise.all([
            this.prisma.payment.groupBy({ by: ['status'], _count: true, _sum: { amount: true }, where }),
            this.prisma.payment.groupBy({ by: ['gatewayProvider'], _count: true, _sum: { amount: true }, where }),
            this.prisma.transaction.findMany({
                where: { status: 'SUCCESS', ...where },
                select: { amount: true, createdAt: true },
                orderBy: { createdAt: 'asc' },
            }),
        ]);
        return {
            byStatus: byStatus.map((s) => ({ status: s.status, count: s._count, amount: s._sum.amount ?? 0 })),
            byProvider: byProvider.map((p) => ({ provider: p.gatewayProvider, count: p._count, amount: p._sum.amount ?? 0 })),
            dailyRevenue,
        };
    }
    async getAdminPendingInvoices(page = 1, limit = 20) {
        const where = { status: { in: ['SENT', 'OVERDUE'] }, deletedAt: null };
        const [data, total] = await Promise.all([
            this.prisma.invoice.findMany({
                where,
                include: {
                    client: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
                    order: { select: { orderNumber: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { dueDate: 'asc' },
            }),
            this.prisma.invoice.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    // ── Phase 8: Client Billing Dashboard ─────────────────────────────
    async getClientBillingDashboard(clientId) {
        const [paymentHistory, outstandingInvoices, activeSubscription, unreadNotifications] = await Promise.all([
            this.prisma.payment.findMany({
                where: { order: { clientId } },
                include: { order: { select: { orderNumber: true } } },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            this.prisma.invoice.findMany({
                where: { clientId, status: { in: ['SENT', 'OVERDUE'] }, deletedAt: null },
                orderBy: { dueDate: 'asc' },
            }),
            this.prisma.subscription.findFirst({
                where: { clientId, deletedAt: null },
                include: { package: { select: { id: true, name: true, type: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notification.count({ where: { userId: clientId, isRead: false, deletedAt: null } }),
        ]);
        return {
            paymentHistory,
            outstandingInvoices,
            activeSubscription,
            unreadNotificationsCount: unreadNotifications,
        };
    }
    // Phase 9: configurable dashboard widgets and KPI summaries
    async getAdminWidgets() {
        const [overview, revenue, pendingInvoices, insights, notifications] = await Promise.all([
            this.getAdminOverview(),
            this.getAdminRevenueOverview(),
            this.getAdminPendingInvoices(1, 5),
            this.prisma.globalSetting.findMany({
                where: { category: 'AI_INSIGHT' },
                orderBy: { updatedAt: 'desc' },
                take: 5,
            }),
            this.prisma.notification.findMany({
                where: { deletedAt: null },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);
        return {
            revenueCard: revenue.revenue,
            activeProjects: overview.metrics.activeProjects,
            pendingTasks: overview.metrics.pendingDeliverables,
            recentPayments: revenue.recentPayments,
            aiInsights: insights.map((insight) => JSON.parse(insight.value)),
            notifications,
            calendar: { upcomingMeetings: overview.metrics.upcomingMeetings },
            teamWorkload: [],
            salesFunnel: {
                activeClients: overview.metrics.totalClients,
                openTickets: overview.metrics.openTickets,
            },
            pendingInvoices,
        };
    }
    async getClientWidgets(clientId) {
        const [dashboard, billing] = await Promise.all([
            this.getClientDashboard(clientId),
            this.getClientBillingDashboard(clientId),
        ]);
        return {
            activeProjects: dashboard.metrics.activeProjects,
            pendingDeliverables: dashboard.metrics.pendingDeliverables,
            upcomingMeetings: dashboard.metrics.upcomingMeetings,
            projectProgress: dashboard.projects,
            recentPayments: billing.paymentHistory,
            invoiceSummary: billing.outstandingInvoices,
            notifications: billing.unreadNotificationsCount,
            recentActivity: dashboard.recentActivity,
        };
    }
    async getDashboardKpis() {
        const [totalRevenue, totalOrders, totalClients, completedProjects, allProjects] = await Promise.all([
            this.prisma.payment.aggregate({ where: { status: 'SUCCESSFUL' }, _sum: { amount: true } }),
            this.prisma.order.aggregate({ where: { deletedAt: null }, _avg: { netAmount: true }, _count: true }),
            this.prisma.clientProfile.count({ where: { deletedAt: null } }),
            this.prisma.project.count({ where: { deletedAt: null, status: 'COMPLETED' } }),
            this.prisma.project.count({ where: { deletedAt: null } }),
        ]);
        const revenue = totalRevenue._sum.amount ?? 0;
        return {
            averageOrderValue: Number((totalOrders._avg.netAmount ?? 0).toFixed(2)),
            customerLifetimeValue: totalClients > 0 ? Number((revenue / totalClients).toFixed(2)) : 0,
            projectCompletionRate: allProjects > 0 ? Number(((completedProjects / allProjects) * 100).toFixed(2)) : 0,
            totalRevenue: revenue,
            totalOrders: totalOrders._count,
            totalClients,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
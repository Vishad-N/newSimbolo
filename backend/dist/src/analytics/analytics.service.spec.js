"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_service_1 = require("./analytics.service");
describe('AnalyticsService', () => {
    it('calculates KPI values from operational aggregates', async () => {
        const prisma = {
            payment: { aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 100000 } }) },
            order: { aggregate: jest.fn().mockResolvedValue({ _avg: { netAmount: 25000 }, _count: 4 }) },
            clientProfile: { count: jest.fn().mockResolvedValue(2) },
            project: { count: jest.fn().mockResolvedValueOnce(3).mockResolvedValueOnce(6) },
        };
        const service = new analytics_service_1.AnalyticsService(prisma);
        jest.spyOn(service, 'getAdminAnalytics').mockResolvedValue({
            generatedAt: new Date('2026-07-28T00:00:00.000Z'),
            revenue: {
                trends: [
                    { period: '2026-06', amount: 50000, count: 2 },
                    { period: '2026-07', amount: 100000, count: 4 },
                ],
                total: 100000,
                paymentCount: 4,
            },
            clients: { active: 2, new: 1, retentionRate: 100 },
            projects: { active: 3, statusDistribution: [], averageCompletionDays: 12 },
            orders: { statusDistribution: [] },
            payments: { successRate: 100, byStatus: [] },
            invoices: { pendingCount: 0, pendingAmount: 0 },
            website: { pageViews: 1000, inquiries: 50 },
            servicePerformance: [],
            packagePopularity: [],
            teamWorkload: [],
            support: { openTickets: 2, averageResolutionHours: 8 },
        });
        await expect(service.getKpis()).resolves.toEqual({
            revenueGrowth: 100,
            conversionRate: 5,
            averageOrderValue: 25000,
            customerLifetimeValue: 50000,
            projectCompletionRate: 50,
            teamUtilization: [],
            averageTicketResolutionTime: 8,
            monthlyRecurringRevenue: 0,
            clientSatisfactionScore: null,
            totalOrders: 4,
        });
    });
});
//# sourceMappingURL=analytics.service.spec.js.map
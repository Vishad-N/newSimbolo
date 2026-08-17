import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
export interface TrendPoint {
    period: string;
    amount: number;
    count: number;
}
export declare class AnalyticsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getDateRange;
    private monthKey;
    private groupRevenueByMonth;
    getAdminAnalytics(query?: AnalyticsQueryDto): Promise<{
        generatedAt: Date;
        revenue: {
            total: number;
            paymentCount: number;
            trends: TrendPoint[];
        };
        clients: {
            active: number;
            new: number;
            retentionRate: number;
        };
        projects: {
            active: number;
            statusDistribution: {
                status: import(".prisma/client").$Enums.ProjectStatusEnum;
                count: number;
            }[];
            averageCompletionDays: number;
        };
        orders: {
            statusDistribution: {
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                count: number;
            }[];
        };
        payments: {
            successRate: number;
            byStatus: {
                status: import(".prisma/client").$Enums.PaymentStatusEnum;
                count: number;
            }[];
        };
        invoices: {
            pendingCount: number;
            pendingAmount: number;
        };
        support: {
            openTickets: number;
            averageResolutionHours: number;
        };
        website: {
            pageViews: number;
            inquiries: number;
        };
        servicePerformance: {
            serviceId: string | null;
            name: string;
            slug: string | null;
            orders: number;
            revenue: number;
        }[];
        packagePopularity: {
            packageId: string | null;
            name: string;
            slug: string | null;
            orders: number;
            revenue: number;
        }[];
        teamWorkload: {
            userId: string | null;
            name: string;
            email: string | null;
            openTasks: number;
            estimatedHours: number;
            actualHours: number;
        }[];
    }>;
    getClientAnalytics(clientId: string): Promise<{
        metrics: {
            activeProjects: number;
            completedProjects: number;
            pendingDeliverables: number;
        };
        recentPayments: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatusEnum;
            currency: string;
            amount: number;
            paymentNumber: string;
            paidAt: Date | null;
        }[];
        invoiceSummary: {
            status: import(".prisma/client").$Enums.InvoiceStatusEnum;
            count: number;
            amount: number;
        }[];
        upcomingMeetings: {
            id: string;
            status: import(".prisma/client").$Enums.MeetingStatusEnum;
            title: string;
            startTime: Date;
            endTime: Date;
        }[];
        projectProgress: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.ProjectStatusEnum;
            progress: number;
            targetEndDate: Date | null;
        }[];
        campaignPerformance: never[];
        recentActivity: {
            id: string;
            date: Date;
            description: string | null;
            title: string;
            eventType: string;
        }[];
    }>;
    getKpis(query?: AnalyticsQueryDto): Promise<{
        revenueGrowth: number;
        conversionRate: number;
        averageOrderValue: number;
        customerLifetimeValue: number;
        projectCompletionRate: number;
        teamUtilization: {
            userId: string | null;
            name: string;
            email: string | null;
            openTasks: number;
            estimatedHours: number;
            actualHours: number;
        }[];
        averageTicketResolutionTime: number;
        monthlyRecurringRevenue: number;
        clientSatisfactionScore: null;
        totalOrders: number;
    }>;
    private calculateGrowth;
}

import { Injectable } from '@nestjs/common';
import {
  InvoiceStatusEnum,
  OrderStatusEnum,
  PaymentStatusEnum,
  ProjectStatusEnum,
  TicketStatusEnum,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

interface DateRange {
  gte?: Date;
  lte?: Date;
}

export interface TrendPoint {
  period: string;
  amount: number;
  count: number;
}

@Injectable()
export class AnalyticsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('AnalyticsService');
  }

  private getDateRange(query: AnalyticsQueryDto): DateRange | undefined {
    if (!query.startDate && !query.endDate) return undefined;
    return {
      ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
      ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
    };
  }

  private monthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private groupRevenueByMonth(payments: { amount: number; paidAt: Date | null; createdAt: Date }[]): TrendPoint[] {
    const trendMap = new Map<string, TrendPoint>();
    for (const payment of payments) {
      const key = this.monthKey(payment.paidAt ?? payment.createdAt);
      const current = trendMap.get(key) ?? { period: key, amount: 0, count: 0 };
      current.amount += payment.amount;
      current.count += 1;
      trendMap.set(key, current);
    }
    return Array.from(trendMap.values()).sort((left, right) => left.period.localeCompare(right.period));
  }

  async getAdminAnalytics(query: AnalyticsQueryDto = {}) {
    const dateRange = this.getDateRange(query);
    const createdAtWhere = dateRange ? { createdAt: dateRange } : {};
    const now = new Date();

    const [
      successfulPayments,
      paymentCounts,
      monthlyRevenue,
      activeClients,
      newClients,
      projectsByStatus,
      ordersByStatus,
      pendingInvoices,
      teamTasks,
      completedProjects,
      openTickets,
      resolvedTickets,
      pageViews,
      inquiries,
      serviceGroups,
      packageGroups,
    ] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: PaymentStatusEnum.SUCCESSFUL, ...createdAtWhere },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.groupBy({
        by: ['status'],
        where: createdAtWhere,
        _count: true,
      }),
      this.prisma.payment.findMany({
        where: { status: PaymentStatusEnum.SUCCESSFUL, ...createdAtWhere },
        select: { amount: true, paidAt: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.clientProfile.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.clientProfile.count({ where: { deletedAt: null, ...createdAtWhere } }),
      this.prisma.project.groupBy({ by: ['status'], where: { deletedAt: null }, _count: true }),
      this.prisma.order.groupBy({ by: ['status'], where: { deletedAt: null, ...createdAtWhere }, _count: true }),
      this.prisma.invoice.aggregate({
        where: { deletedAt: null, status: { in: [InvoiceStatusEnum.SENT, InvoiceStatusEnum.OVERDUE] } },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.task.groupBy({
        by: ['assignedToId'],
        where: { assignedToId: { not: null }, status: { not: 'COMPLETED' } },
        _count: true,
        _sum: { estimatedHours: true, actualHours: true },
      }),
      this.prisma.project.findMany({
        where: {
          deletedAt: null,
          status: ProjectStatusEnum.COMPLETED,
          startDate: { not: null },
          actualEndDate: { not: null },
        },
        select: { startDate: true, actualEndDate: true },
      }),
      this.prisma.supportTicket.count({
        where: { deletedAt: null, status: { in: [TicketStatusEnum.OPEN, TicketStatusEnum.IN_PROGRESS] } },
      }),
      this.prisma.supportTicket.findMany({
        where: {
          deletedAt: null,
          status: { in: [TicketStatusEnum.RESOLVED, TicketStatusEnum.CLOSED] },
          closedAt: { not: null },
        },
        select: { createdAt: true, closedAt: true },
      }),
      this.prisma.pageView.count({ where: dateRange ? { timestamp: dateRange } : {} }),
      this.prisma.eventLog.count({
        where: {
          eventCategory: 'INQUIRY',
          ...(dateRange ? { timestamp: dateRange } : {}),
        },
      }),
      this.prisma.order.groupBy({
        by: ['serviceId'],
        where: {
          deletedAt: null,
          serviceId: { not: null },
          status: { notIn: [OrderStatusEnum.CANCELLED, OrderStatusEnum.REFUNDED] },
        },
        _count: true,
        _sum: { netAmount: true },
      }),
      this.prisma.order.groupBy({
        by: ['packageId'],
        where: {
          deletedAt: null,
          packageId: { not: null },
          status: { notIn: [OrderStatusEnum.CANCELLED, OrderStatusEnum.REFUNDED] },
        },
        _count: true,
        _sum: { netAmount: true },
      }),
    ]);

    const successCount = paymentCounts.find((item) => item.status === PaymentStatusEnum.SUCCESSFUL)?._count ?? 0;
    const totalPayments = paymentCounts.reduce((sum, item) => sum + item._count, 0);
    const paymentSuccessRate = totalPayments > 0 ? Number(((successCount / totalPayments) * 100).toFixed(2)) : 0;

    const averageProjectCompletionDays =
      completedProjects.length > 0
        ? Number(
            (
              completedProjects.reduce((sum, project) => {
                const startDate = project.startDate as Date;
                const endDate = project.actualEndDate as Date;
                return sum + (endDate.getTime() - startDate.getTime()) / 86400000;
              }, 0) / completedProjects.length
            ).toFixed(2),
          )
        : 0;

    const averageTicketResolutionHours =
      resolvedTickets.length > 0
        ? Number(
            (
              resolvedTickets.reduce((sum, ticket) => {
                const closedAt = ticket.closedAt as Date;
                return sum + (closedAt.getTime() - ticket.createdAt.getTime()) / 3600000;
              }, 0) / resolvedTickets.length
            ).toFixed(2),
          )
        : 0;

    const serviceIds = serviceGroups.map((item) => item.serviceId).filter((id): id is string => Boolean(id));
    const packageIds = packageGroups.map((item) => item.packageId).filter((id): id is string => Boolean(id));
    const [services, packages, workloadUsers] = await Promise.all([
      this.prisma.service.findMany({ where: { id: { in: serviceIds } }, select: { id: true, name: true, slug: true } }),
      this.prisma.package.findMany({ where: { id: { in: packageIds } }, select: { id: true, name: true, slug: true } }),
      this.prisma.user.findMany({
        where: { id: { in: teamTasks.map((item) => item.assignedToId).filter((id): id is string => Boolean(id)) } },
        select: { id: true, firstName: true, lastName: true, email: true },
      }),
    ]);

    const servicePerformance = serviceGroups.map((item) => {
      const service = services.find((record) => record.id === item.serviceId);
      return {
        serviceId: item.serviceId,
        name: service?.name ?? 'Unknown Service',
        slug: service?.slug ?? null,
        orders: item._count,
        revenue: item._sum.netAmount ?? 0,
      };
    });

    const packagePopularity = packageGroups.map((item) => {
      const packageRecord = packages.find((record) => record.id === item.packageId);
      return {
        packageId: item.packageId,
        name: packageRecord?.name ?? 'Unknown Package',
        slug: packageRecord?.slug ?? null,
        orders: item._count,
        revenue: item._sum.netAmount ?? 0,
      };
    });

    const teamWorkload = teamTasks.map((item) => {
      const user = workloadUsers.find((record) => record.id === item.assignedToId);
      return {
        userId: item.assignedToId,
        name: user ? `${user.firstName} ${user.lastName}` : 'Unassigned',
        email: user?.email ?? null,
        openTasks: item._count,
        estimatedHours: item._sum.estimatedHours ?? 0,
        actualHours: item._sum.actualHours ?? 0,
      };
    });

    const activeProjectStatuses: ProjectStatusEnum[] = [
      ProjectStatusEnum.PLANNING,
      ProjectStatusEnum.ACTIVE,
      ProjectStatusEnum.IN_PROGRESS,
    ];
    const activeProjects = projectsByStatus
      .filter((item) => activeProjectStatuses.includes(item.status))
      .reduce((sum, item) => sum + item._count, 0);

    return {
      generatedAt: now,
      revenue: {
        total: successfulPayments._sum.amount ?? 0,
        paymentCount: successfulPayments._count,
        trends: this.groupRevenueByMonth(monthlyRevenue),
      },
      clients: {
        active: activeClients,
        new: newClients,
        retentionRate: activeClients > 0 ? 100 : 0,
      },
      projects: {
        active: activeProjects,
        statusDistribution: projectsByStatus.map((item) => ({ status: item.status, count: item._count })),
        averageCompletionDays: averageProjectCompletionDays,
      },
      orders: {
        statusDistribution: ordersByStatus.map((item) => ({ status: item.status, count: item._count })),
      },
      payments: {
        successRate: paymentSuccessRate,
        byStatus: paymentCounts.map((item) => ({ status: item.status, count: item._count })),
      },
      invoices: {
        pendingCount: pendingInvoices._count,
        pendingAmount: pendingInvoices._sum.totalAmount ?? 0,
      },
      support: {
        openTickets,
        averageResolutionHours: averageTicketResolutionHours,
      },
      website: {
        pageViews,
        inquiries,
      },
      servicePerformance,
      packagePopularity,
      teamWorkload,
    };
  }

  async getClientAnalytics(clientId: string) {
    const now = new Date();
    const [
      activeProjects,
      completedProjects,
      pendingDeliverables,
      recentPayments,
      invoiceSummary,
      upcomingMeetings,
      projects,
      recentActivity,
    ] = await Promise.all([
      this.prisma.project.count({
        where: {
          clientId,
          deletedAt: null,
          status: { in: [ProjectStatusEnum.PLANNING, ProjectStatusEnum.ACTIVE, ProjectStatusEnum.IN_PROGRESS] },
        },
      }),
      this.prisma.project.count({ where: { clientId, deletedAt: null, status: ProjectStatusEnum.COMPLETED } }),
      this.prisma.deliverable.count({
        where: { deletedAt: null, project: { clientId }, status: { in: ['PENDING', 'SUBMITTED'] } },
      }),
      this.prisma.payment.findMany({
        where: { order: { clientId } },
        select: {
          id: true,
          paymentNumber: true,
          amount: true,
          currency: true,
          status: true,
          paidAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.invoice.groupBy({
        by: ['status'],
        where: { clientId, deletedAt: null },
        _count: true,
        _sum: { totalAmount: true },
      }),
      this.prisma.meeting.findMany({
        where: { clientId, deletedAt: null, startTime: { gte: now } },
        select: { id: true, title: true, startTime: true, endTime: true, status: true },
        orderBy: { startTime: 'asc' },
        take: 5,
      }),
      this.prisma.project.findMany({
        where: { clientId, deletedAt: null },
        select: { id: true, name: true, status: true, progress: true, targetEndDate: true },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),
      this.prisma.timeline.findMany({
        where: { clientId },
        select: { id: true, title: true, description: true, eventType: true, date: true },
        orderBy: { date: 'desc' },
        take: 15,
      }),
    ]);

    return {
      metrics: {
        activeProjects,
        completedProjects,
        pendingDeliverables,
      },
      recentPayments,
      invoiceSummary: invoiceSummary.map((item) => ({
        status: item.status,
        count: item._count,
        amount: item._sum.totalAmount ?? 0,
      })),
      upcomingMeetings,
      projectProgress: projects,
      campaignPerformance: [],
      recentActivity,
    };
  }

  async getKpis(query: AnalyticsQueryDto = {}) {
    const analytics = await this.getAdminAnalytics(query);
    const [orders, clients, completedProjects, allProjects] = await Promise.all([
      this.prisma.order.aggregate({ where: { deletedAt: null }, _avg: { netAmount: true }, _count: true }),
      this.prisma.clientProfile.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { deletedAt: null, status: ProjectStatusEnum.COMPLETED } }),
      this.prisma.project.count({ where: { deletedAt: null } }),
    ]);

    return {
      revenueGrowth:
        analytics.revenue.trends.length >= 2
          ? this.calculateGrowth(
              analytics.revenue.trends.at(-2)?.amount ?? 0,
              analytics.revenue.trends.at(-1)?.amount ?? 0,
            )
          : 0,
      conversionRate:
        analytics.website.pageViews > 0
          ? Number(((analytics.website.inquiries / analytics.website.pageViews) * 100).toFixed(2))
          : 0,
      averageOrderValue: Number((orders._avg.netAmount ?? 0).toFixed(2)),
      customerLifetimeValue: clients > 0 ? Number((analytics.revenue.total / clients).toFixed(2)) : 0,
      projectCompletionRate: allProjects > 0 ? Number(((completedProjects / allProjects) * 100).toFixed(2)) : 0,
      teamUtilization: analytics.teamWorkload,
      averageTicketResolutionTime: analytics.support.averageResolutionHours,
      monthlyRecurringRevenue: 0,
      clientSatisfactionScore: null,
      totalOrders: orders._count,
    };
  }

  private calculateGrowth(previous: number, current: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
  }
}

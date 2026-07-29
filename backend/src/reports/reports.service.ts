import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { GenerateReportDto, ReportResult, ReportType } from './dto/report.dto';

type ReportRow = Record<string, string | number | boolean | null>;

@Injectable()
export class ReportsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('ReportsService');
  }

  private createdAtWhere(dto: GenerateReportDto) {
    if (!dto.startDate && !dto.endDate) return {};
    return {
      createdAt: {
        ...(dto.startDate ? { gte: new Date(dto.startDate) } : {}),
        ...(dto.endDate ? { lte: new Date(dto.endDate) } : {}),
      },
    };
  }

  async generate(dto: GenerateReportDto): Promise<ReportResult> {
    switch (dto.type) {
      case ReportType.REVENUE:
        return this.generateRevenueReport(dto);
      case ReportType.CLIENTS:
        return this.generateClientsReport(dto);
      case ReportType.PROJECTS:
        return this.generateProjectsReport(dto);
      case ReportType.ORDERS:
        return this.generateOrdersReport(dto);
      case ReportType.PAYMENTS:
        return this.generatePaymentsReport(dto);
      case ReportType.TEAM_PERFORMANCE:
        return this.generateTeamReport(dto);
      case ReportType.MARKETING_PERFORMANCE:
        return this.generateMarketingReport(dto);
      case ReportType.SUPPORT_TICKETS:
        return this.generateSupportReport(dto);
      case ReportType.CONTENT_PERFORMANCE:
        return this.generateContentReport(dto);
      case ReportType.WEBSITE_ANALYTICS:
        return this.generateWebsiteReport(dto);
      default:
        throw new BadRequestException('Unsupported report type');
    }
  }

  private buildReport(
    type: ReportType,
    title: string,
    dto: GenerateReportDto,
    columns: string[],
    rows: ReportRow[],
    totals: Record<string, number>,
  ): ReportResult {
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

  private async generateRevenueReport(dto: GenerateReportDto) {
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
    const reportRows = rows.map((row): ReportRow => ({
      paymentNumber: row.paymentNumber,
      orderNumber: row.order?.orderNumber ?? null,
      amount: row.amount,
      currency: row.currency,
      gatewayProvider: row.gatewayProvider,
      paidAt: row.paidAt?.toISOString() ?? null,
    }));
    return this.buildReport(
      ReportType.REVENUE,
      'Revenue Report',
      dto,
      ['paymentNumber', 'orderNumber', 'amount', 'currency', 'gatewayProvider', 'paidAt'],
      reportRows,
      { totalRevenue: rows.reduce((sum, row) => sum + row.amount, 0), totalPayments: rows.length },
    );
  }

  private async generateClientsReport(dto: GenerateReportDto) {
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
    return this.buildReport(
      ReportType.CLIENTS,
      'Clients Report',
      dto,
      ['clientId', 'name', 'email', 'company', 'industry', 'status', 'orders', 'projects', 'createdAt'],
      rows.map((row): ReportRow => ({
        clientId: row.id,
        name: `${row.user.firstName} ${row.user.lastName}`,
        email: row.user.email,
        company: row.company?.name ?? null,
        industry: row.company?.industry ?? null,
        status: row.status,
        orders: row._count.orders,
        projects: row._count.projects,
        createdAt: row.createdAt.toISOString(),
      })),
      { totalClients: rows.length },
    );
  }

  private async generateProjectsReport(dto: GenerateReportDto) {
    const rows = await this.prisma.project.findMany({
      where: { deletedAt: null, ...this.createdAtWhere(dto) },
      select: { id: true, name: true, status: true, priority: true, progress: true, budget: true, createdAt: true },
      orderBy: { updatedAt: 'desc' },
    });
    return this.buildReport(
      ReportType.PROJECTS,
      'Projects Report',
      dto,
      ['projectId', 'name', 'status', 'priority', 'progress', 'budget', 'createdAt'],
      rows.map((row): ReportRow => ({
        projectId: row.id,
        name: row.name,
        status: row.status,
        priority: row.priority,
        progress: row.progress,
        budget: row.budget ?? 0,
        createdAt: row.createdAt.toISOString(),
      })),
      { totalProjects: rows.length, totalBudget: rows.reduce((sum, row) => sum + (row.budget ?? 0), 0) },
    );
  }

  private async generateOrdersReport(dto: GenerateReportDto) {
    const rows = await this.prisma.order.findMany({
      where: { deletedAt: null, ...this.createdAtWhere(dto) },
      select: { orderNumber: true, status: true, netAmount: true, currency: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return this.buildReport(
      ReportType.ORDERS,
      'Orders Report',
      dto,
      ['orderNumber', 'status', 'netAmount', 'currency', 'createdAt'],
      rows.map((row): ReportRow => ({
        orderNumber: row.orderNumber,
        status: row.status,
        netAmount: row.netAmount,
        currency: row.currency,
        createdAt: row.createdAt.toISOString(),
      })),
      { totalOrders: rows.length, totalValue: rows.reduce((sum, row) => sum + row.netAmount, 0) },
    );
  }

  private async generatePaymentsReport(dto: GenerateReportDto) {
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
    return this.buildReport(
      ReportType.PAYMENTS,
      'Payments Report',
      dto,
      ['paymentNumber', 'status', 'amount', 'currency', 'gatewayProvider', 'createdAt'],
      rows.map((row): ReportRow => ({
        paymentNumber: row.paymentNumber,
        status: row.status,
        amount: row.amount,
        currency: row.currency,
        gatewayProvider: row.gatewayProvider,
        createdAt: row.createdAt.toISOString(),
      })),
      { totalPayments: rows.length, totalAmount: rows.reduce((sum, row) => sum + row.amount, 0) },
    );
  }

  private async generateTeamReport(dto: GenerateReportDto) {
    const rows = await this.prisma.task.groupBy({
      by: ['assignedToId'],
      where: { assignedToId: { not: null }, ...this.createdAtWhere(dto) },
      _count: true,
      _sum: { estimatedHours: true, actualHours: true },
    });
    const users = await this.prisma.user.findMany({
      where: { id: { in: rows.map((row) => row.assignedToId).filter((id): id is string => Boolean(id)) } },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    return this.buildReport(
      ReportType.TEAM_PERFORMANCE,
      'Team Performance Report',
      dto,
      ['userId', 'name', 'email', 'tasks', 'estimatedHours', 'actualHours'],
      rows.map((row): ReportRow => {
        const user = users.find((record) => record.id === row.assignedToId);
        return {
          userId: row.assignedToId,
          name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          email: user?.email ?? null,
          tasks: row._count,
          estimatedHours: row._sum.estimatedHours ?? 0,
          actualHours: row._sum.actualHours ?? 0,
        };
      }),
      { totalAssignedTasks: rows.reduce((sum, row) => sum + row._count, 0) },
    );
  }

  private async generateMarketingReport(dto: GenerateReportDto) {
    const rows = await this.prisma.eventLog.groupBy({
      by: ['eventName', 'eventCategory'],
      where: dto.startDate || dto.endDate ? { timestamp: this.createdAtWhere(dto).createdAt } : {},
      _count: true,
    });
    return this.buildReport(
      ReportType.MARKETING_PERFORMANCE,
      'Marketing Performance Report',
      dto,
      ['eventName', 'eventCategory', 'count'],
      rows.map((row): ReportRow => ({ eventName: row.eventName, eventCategory: row.eventCategory, count: row._count })),
      { totalEvents: rows.reduce((sum, row) => sum + row._count, 0) },
    );
  }

  private async generateSupportReport(dto: GenerateReportDto) {
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
    return this.buildReport(
      ReportType.SUPPORT_TICKETS,
      'Support Tickets Report',
      dto,
      ['ticketNumber', 'subject', 'status', 'priority', 'category', 'createdAt', 'closedAt'],
      rows.map((row): ReportRow => ({
        ticketNumber: row.ticketNumber,
        subject: row.subject,
        status: row.status,
        priority: row.priority,
        category: row.category ?? null,
        createdAt: row.createdAt.toISOString(),
        closedAt: row.closedAt?.toISOString() ?? null,
      })),
      { totalTickets: rows.length },
    );
  }

  private async generateContentReport(dto: GenerateReportDto) {
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
    const rows: ReportRow[] = [
      ...blogs.map((row): ReportRow => ({ contentType: 'Blog', status: row.status, count: row._count })),
      ...caseStudies.map((row): ReportRow => ({ contentType: 'Case Study', status: row.status, count: row._count })),
    ];
    return this.buildReport(
      ReportType.CONTENT_PERFORMANCE,
      'Content Performance Report',
      dto,
      ['contentType', 'status', 'count'],
      rows,
      { totalContentItems: rows.reduce((sum, row) => sum + Number(row.count), 0) },
    );
  }

  private async generateWebsiteReport(dto: GenerateReportDto) {
    const rows = await this.prisma.pageView.groupBy({
      by: ['path', 'deviceType'],
      where: dto.startDate || dto.endDate ? { timestamp: this.createdAtWhere(dto).createdAt } : {},
      _count: true,
    });
    return this.buildReport(
      ReportType.WEBSITE_ANALYTICS,
      'Website Analytics Report',
      dto,
      ['path', 'deviceType', 'views'],
      rows.map((row): ReportRow => ({ path: row.path, deviceType: row.deviceType ?? 'unknown', views: row._count })),
      { totalViews: rows.reduce((sum, row) => sum + row._count, 0) },
    );
  }
}

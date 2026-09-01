import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { BusinessInsight, InsightCategory, InsightQueryDto } from './dto/insight.dto';

@Injectable()
export class InsightsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('InsightsService');
  }

  async generateInsights(): Promise<BusinessInsight[]> {
    const [packageRevenue, serviceOrders, longRunningProjects, overloadedMembers, delayedPayments, popularBlogs] =
      await Promise.all([
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

    const insights: BusinessInsight[] = [];
    if (packageRevenue[0]) {
      insights.push({
        id: 'most-profitable-package',
        category: InsightCategory.REVENUE,
        title: 'Most Profitable Package Identified',
        description: `Top package generated ${packageRevenue[0]._sum.netAmount ?? 0} from ${packageRevenue[0]._count} orders.`,
        severity: 'LOW',
        metric: Number(packageRevenue[0]._sum.netAmount ?? 0),
        generatedAt: new Date().toISOString(),
      });
    }
    if (serviceOrders[0]) {
      insights.push({
        id: 'frequently-requested-service',
        category: InsightCategory.SERVICE,
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
        category: InsightCategory.PROJECT,
        title: 'Long-Running Project Risk',
        description: `${project.name} is past its target end date.`,
        severity: 'HIGH',
        generatedAt: new Date().toISOString(),
      });
    }
    for (const member of overloadedMembers) {
      insights.push({
        id: `overloaded-member-${member.assignedToId}`,
        category: InsightCategory.TEAM,
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
        category: InsightCategory.PAYMENT,
        title: 'Payment Delay',
        description: `Invoice ${invoice.invoiceNumber} is overdue with amount ${invoice.totalAmount}.`,
        severity: 'HIGH',
        metric: Number(invoice.totalAmount),
        generatedAt: new Date().toISOString(),
      });
    }
    for (const blog of popularBlogs) {
      insights.push({
        id: `popular-topic-${blog.id}`,
        category: InsightCategory.CONTENT,
        title: 'Recent Blog Topic Opportunity',
        description: `${blog.title} can be repurposed into social posts, FAQs, and email content.`,
        severity: 'LOW',
        metric: blog.readingTimeMin,
        generatedAt: new Date().toISOString(),
      });
    }

    await Promise.all(
      insights.map((insight) =>
        this.prisma.globalSetting.upsert({
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
        }),
      ),
    );

    return insights;
  }

  async findInsights(query: InsightQueryDto = {}) {
    const records = await this.prisma.globalSetting.findMany({
      where: { category: 'AI_INSIGHT' },
      orderBy: { updatedAt: 'desc' },
    });
    const insights = records
      .map((record) => JSON.parse(record.value) as BusinessInsight)
      .filter((insight) => (query.category ? insight.category === query.category : true));
    return { data: insights, meta: { total: insights.length } };
  }
}

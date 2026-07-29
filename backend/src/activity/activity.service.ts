import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';

@Injectable()
export class ActivityService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('ActivityService');
  }

  async getGlobalFeed(filters: {
    eventType?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { eventType, startDate, endDate, page = 1, limit = 50 } = filters;
    const where: any = {};

    if (eventType) where.eventType = eventType;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
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

  async getProjectActivity(projectId: string, page = 1, limit = 50) {
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

  async getClientActivity(clientId: string, page = 1, limit = 50) {
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

  async recordActivity(data: {
    title: string;
    description?: string;
    eventType: string;
    projectId?: string;
    clientId?: string;
    orderId?: string;
    ticketId?: string;
    meetingId?: string;
    deliverableId?: string;
    userId?: string;
    metadata?: Record<string, any>;
  }) {
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

  async getEventTypes(): Promise<{ eventTypes: string[] }> {
    const events = await this.prisma.timeline.findMany({
      distinct: ['eventType'],
      select: { eventType: true },
    });
    return { eventTypes: events.map((e) => e.eventType) };
  }
}

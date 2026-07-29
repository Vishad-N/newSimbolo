import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AuditQueryDto } from './dto/audit-query.dto';

@Injectable()
export class AuditQueryService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('AuditQueryService');
  }

  async findAll(query: AuditQueryDto) {
    const where = {
      ...(query.action ? { action: { contains: query.action, mode: 'insensitive' as const } } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.startDate || query.endDate
        ? {
            createdAt: {
              ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
              ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
            },
          }
        : {}),
    };
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async summary(query: AuditQueryDto) {
    const data = await this.findAll({ ...query, page: 1, limit: 100 });
    const byEntity = new Map<string, number>();
    const byAction = new Map<string, number>();
    for (const log of data.data) {
      byEntity.set(log.entityType, (byEntity.get(log.entityType) ?? 0) + 1);
      byAction.set(log.action, (byAction.get(log.action) ?? 0) + 1);
    }
    return {
      byEntityType: Array.from(byEntity.entries()).map(([entityType, count]) => ({ entityType, count })),
      byAction: Array.from(byAction.entries()).map(([action, count]) => ({ action, count })),
    };
  }
}

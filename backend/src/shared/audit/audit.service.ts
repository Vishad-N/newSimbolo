import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../abstractions/base.service';

export interface LogAuditDto {
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, any> | string;
  newValue?: Record<string, any> | string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

@Injectable()
export class AuditService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super(AuditService.name);
  }

  async logEvent(dto: LogAuditDto): Promise<void> {
    try {
      const oldValueStr = typeof dto.oldValue === 'object' ? JSON.stringify(dto.oldValue) : dto.oldValue;
      const newValueStr = typeof dto.newValue === 'object' ? JSON.stringify(dto.newValue) : dto.newValue;

      await this.prisma.auditLog.create({
        data: {
          action: dto.action,
          entityType: dto.entityType,
          entityId: dto.entityId,
          oldValue: oldValueStr,
          newValue: newValueStr,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
          userId: dto.userId,
        },
      });
      this.logger.debug(
        `🔒 [AUDIT] Action: ${dto.action} | Entity: ${dto.entityType} (${dto.entityId}) | User: ${dto.userId || 'System'}`,
      );
    } catch (error) {
      this.logger.error(`Failed to create audit log entry for action "${dto.action}":`, (error as Error).stack);
    }
  }

  async getLogsByEntity(entityType: string, entityId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async getLogsByUser(userId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

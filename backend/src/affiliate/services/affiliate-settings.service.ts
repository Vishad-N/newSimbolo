import { Injectable } from '@nestjs/common';
import { AffiliateSettings } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { UpdateAffiliateSettingsDto } from '../dto/update-affiliate-settings.dto';

/**
 * Singleton settings accessor for the affiliate/commission program.
 *
 * The migration seeds exactly one row; this service is defensive and will create
 * the default row if the table is somehow empty (fresh test DBs, manual truncation).
 */
@Injectable()
export class AffiliateSettingsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {
    super('AffiliateSettingsService');
  }

  async get(): Promise<AffiliateSettings> {
    const existing = await this.prisma.affiliateSettings.findFirst({ orderBy: { updatedAt: 'asc' } });
    if (existing) return existing;

    this.logger.warn('No AffiliateSettings row found — creating program defaults');
    return this.prisma.affiliateSettings.create({ data: {} });
  }

  async update(dto: UpdateAffiliateSettingsDto, actorUserId?: string): Promise<AffiliateSettings> {
    const current = await this.get();

    const updated = await this.prisma.affiliateSettings.update({
      where: { id: current.id },
      data: { ...dto, updatedBy: actorUserId ?? null },
    });

    await this.auditService.logEvent({
      action: 'affiliate.settings.updated',
      entityType: 'AffiliateSettings',
      entityId: current.id,
      oldValue: current as unknown as Record<string, any>,
      newValue: updated as unknown as Record<string, any>,
      userId: actorUserId,
    });

    return updated;
  }
}

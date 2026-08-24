import { Injectable } from '@nestjs/common';
import { AffiliateSettings } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { CacheService } from '../../cache/cache.service';
import { UpdateAffiliateSettingsDto } from '../dto/update-affiliate-settings.dto';

const CACHE_KEY = 'affiliate-settings';
const CACHE_TTL_SECONDS = 300;

/**
 * Singleton settings accessor for the affiliate/commission program.
 *
 * The migration seeds exactly one row; this service is defensive and will create
 * the default row if the table is somehow empty (fresh test DBs, manual truncation).
 *
 * get() is on nearly every affiliate/commission/payment-webhook code path
 * (employee creation, commission settlement, the sweep, checkout code validation),
 * so it's cached with a short TTL rather than hitting the DB every time — this
 * setting changes rarely and a few minutes of staleness is a non-issue.
 */
@Injectable()
export class AffiliateSettingsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly cache: CacheService,
  ) {
    super('AffiliateSettingsService');
  }

  async get(): Promise<AffiliateSettings> {
    const cached = await this.cache.get<AffiliateSettings>(CACHE_KEY);
    if (cached) return cached;

    let settings = await this.prisma.affiliateSettings.findFirst({ orderBy: { updatedAt: 'asc' } });
    if (!settings) {
      this.logger.warn('No AffiliateSettings row found — creating program defaults');
      settings = await this.prisma.affiliateSettings.create({ data: {} });
    }

    await this.cache.set(CACHE_KEY, settings, CACHE_TTL_SECONDS);
    return settings;
  }

  async update(dto: UpdateAffiliateSettingsDto, actorUserId?: string): Promise<AffiliateSettings> {
    const current = await this.get();

    const updated = await this.prisma.affiliateSettings.update({
      where: { id: current.id },
      data: { ...dto, updatedBy: actorUserId ?? null },
    });

    await this.cache.deleteByPrefix(CACHE_KEY);

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

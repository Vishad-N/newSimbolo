import { AffiliateSettings } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { CacheService } from '../../cache/cache.service';
import { UpdateAffiliateSettingsDto } from '../dto/update-affiliate-settings.dto';
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
export declare class AffiliateSettingsService extends BaseService {
    private readonly prisma;
    private readonly auditService;
    private readonly cache;
    constructor(prisma: PrismaService, auditService: AuditService, cache: CacheService);
    get(): Promise<AffiliateSettings>;
    update(dto: UpdateAffiliateSettingsDto, actorUserId?: string): Promise<AffiliateSettings>;
}

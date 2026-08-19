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
export declare class AffiliateSettingsService extends BaseService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    get(): Promise<AffiliateSettings>;
    update(dto: UpdateAffiliateSettingsDto, actorUserId?: string): Promise<AffiliateSettings>;
}

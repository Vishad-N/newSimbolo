import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { AffiliateSettingsService } from './affiliate-settings.service';
import { CommissionService } from './commission.service';
import { WithdrawalService } from './withdrawal.service';
export interface SweepResult {
    scannedCommissions: number;
    creditedCommissions: number;
    failedCommissions: number;
    scannedWithdrawals: number;
    processedWithdrawals: number;
    failedWithdrawals: number;
    autoPayoutEnabled: boolean;
}
/**
 * Periodic eligibility + auto-payout sweep.
 *
 * There is no cron scheduler in this codebase (@nestjs/schedule is not installed),
 * so this runs as a BullMQ repeatable job. When Redis is not configured the queue is
 * a no-op — the same `run()` is therefore also exposed via
 * POST /admin/affiliate/settings/run-sweep so eligibility promotion remains
 * operable and testable without Redis.
 *
 * Every step is individually idempotent, so re-running the sweep at any frequency
 * is safe.
 */
export declare class CommissionSweepService extends BaseService {
    private readonly prisma;
    private readonly settingsService;
    private readonly commissionService;
    private readonly withdrawalService;
    private readonly notifications;
    private static readonly BATCH_SIZE;
    constructor(prisma: PrismaService, settingsService: AffiliateSettingsService, commissionService: CommissionService, withdrawalService: WithdrawalService, notifications: NotificationsService);
    run(): Promise<SweepResult>;
}

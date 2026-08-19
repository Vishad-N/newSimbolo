import { Injectable } from '@nestjs/common';
import { CommissionStatusEnum, WithdrawalStatusEnum } from '@prisma/client';
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
@Injectable()
export class CommissionSweepService extends BaseService {
  private static readonly BATCH_SIZE = 200;

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: AffiliateSettingsService,
    private readonly commissionService: CommissionService,
    private readonly withdrawalService: WithdrawalService,
    private readonly notifications: NotificationsService,
  ) {
    super('CommissionSweepService');
  }

  async run(): Promise<SweepResult> {
    const now = new Date();
    const settings = await this.settingsService.get();

    const result: SweepResult = {
      scannedCommissions: 0,
      creditedCommissions: 0,
      failedCommissions: 0,
      scannedWithdrawals: 0,
      processedWithdrawals: 0,
      failedWithdrawals: 0,
      autoPayoutEnabled: settings.payoutAutoProcessingEnabled,
    };

    // (a) PENDING commissions whose hold period has elapsed -> ELIGIBLE -> CREDITED.
    const due = await this.prisma.commission.findMany({
      where: {
        status: CommissionStatusEnum.PENDING,
        eligibleAt: { not: null, lte: now },
      },
      select: { id: true, commissionAmount: true, affiliate: { select: { userId: true } } },
      take: CommissionSweepService.BATCH_SIZE,
      orderBy: { eligibleAt: 'asc' },
    });

    result.scannedCommissions = due.length;

    for (const commission of due) {
      try {
        const credited = await this.commissionService.promoteEligibleToCredited(commission.id);
        if (credited.credited) {
          result.creditedCommissions += 1;
          await this.notifications
            .notifyCommissionCredited(commission.affiliate.userId, commission.commissionAmount)
            .catch(() => undefined);
        }
      } catch (error) {
        result.failedCommissions += 1;
        this.logger.error(`Sweep failed to credit commission ${commission.id}: ${(error as Error).message}`);
      }
    }

    // Also pick up commissions already promoted to ELIGIBLE by an earlier partial run.
    const eligible = await this.prisma.commission.findMany({
      where: { status: CommissionStatusEnum.ELIGIBLE },
      select: { id: true, commissionAmount: true, affiliate: { select: { userId: true } } },
      take: CommissionSweepService.BATCH_SIZE,
    });

    for (const commission of eligible) {
      result.scannedCommissions += 1;
      try {
        const credited = await this.commissionService.promoteEligibleToCredited(commission.id);
        if (credited.credited) {
          result.creditedCommissions += 1;
          await this.notifications
            .notifyCommissionCredited(commission.affiliate.userId, commission.commissionAmount)
            .catch(() => undefined);
        }
      } catch (error) {
        result.failedCommissions += 1;
        this.logger.error(`Sweep failed to credit commission ${commission.id}: ${(error as Error).message}`);
      }
    }

    // (b) Auto-payout of scheduled withdrawals, if enabled.
    if (settings.payoutAutoProcessingEnabled) {
      const scheduled = await this.prisma.withdrawal.findMany({
        where: {
          status: WithdrawalStatusEnum.SCHEDULED,
          scheduledAt: { not: null, lte: now },
        },
        select: { id: true },
        take: CommissionSweepService.BATCH_SIZE,
        orderBy: { scheduledAt: 'asc' },
      });

      result.scannedWithdrawals = scheduled.length;

      for (const withdrawal of scheduled) {
        try {
          await this.withdrawalService.process(withdrawal.id);
          result.processedWithdrawals += 1;
        } catch (error) {
          result.failedWithdrawals += 1;
          this.logger.error(`Sweep failed to process withdrawal ${withdrawal.id}: ${(error as Error).message}`);
        }
      }
    }

    this.logger.log(
      `Commission sweep complete — credited ${result.creditedCommissions}/${result.scannedCommissions} commissions, ` +
        `processed ${result.processedWithdrawals}/${result.scannedWithdrawals} withdrawals`,
    );

    return result;
  }
}

import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { QueueService } from '../queues/queue.service';
import { AffiliateCheckoutController } from './controllers/affiliate-checkout.controller';
import { AffiliateMeController } from './controllers/affiliate-me.controller';
import { AdminAffiliateController } from './controllers/admin-affiliate.controller';
import { RazorpayXWebhookController } from './controllers/razorpayx-webhook.controller';
import { AffiliateSettingsService } from './services/affiliate-settings.service';
import { AffiliateService } from './services/affiliate.service';
import { CommissionService } from './services/commission.service';
import { CommissionSweepService } from './services/commission-sweep.service';
import { PayoutMethodService } from './services/payout-method.service';
import { RazorpayXGateway } from './services/razorpayx.provider';
import { WalletService } from './services/wallet.service';
import { WithdrawalService } from './services/withdrawal.service';

export const COMMISSION_QUEUE = 'commissions' as const;
export const COMMISSION_SWEEP_JOB = 'commission-eligibility-sweep';
const SWEEP_INTERVAL_MS = 15 * 60 * 1000;

/**
 * Dependency direction is deliberately one-way:
 *   WebhooksModule -> PaymentsModule -> AffiliateModule
 * AffiliateModule imports only PrismaModule + NotificationsModule (AuditModule and
 * QueuesModule are @Global), so no forwardRef is required anywhere.
 */
@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [
    AffiliateCheckoutController,
    AffiliateMeController,
    AdminAffiliateController,
    RazorpayXWebhookController,
  ],
  providers: [
    AffiliateService,
    AffiliateSettingsService,
    CommissionService,
    WalletService,
    PayoutMethodService,
    WithdrawalService,
    CommissionSweepService,
    RazorpayXGateway,
  ],
  exports: [
    AffiliateService,
    AffiliateSettingsService,
    CommissionService,
    WalletService,
    WithdrawalService,
    CommissionSweepService,
  ],
})
export class AffiliateModule implements OnModuleInit {
  constructor(
    private readonly queueService: QueueService,
    private readonly sweepService: CommissionSweepService,
  ) {}

  /**
   * Registers the eligibility sweep as a BullMQ repeatable job.
   * When Redis is not configured QueueService is a no-op — the sweep simply does not
   * run automatically, and operators use POST /admin/affiliate/settings/run-sweep.
   */
  async onModuleInit(): Promise<void> {
    this.queueService.registerWorker(COMMISSION_QUEUE, async () => {
      await this.sweepService.run();
    });

    await this.queueService.add(
      COMMISSION_QUEUE,
      COMMISSION_SWEEP_JOB,
      {},
      { repeat: { every: SWEEP_INTERVAL_MS }, jobId: COMMISSION_SWEEP_JOB },
    );
  }
}

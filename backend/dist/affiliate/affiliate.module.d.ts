import { OnModuleInit } from '@nestjs/common';
import { QueueService } from '../queues/queue.service';
import { CommissionSweepService } from './services/commission-sweep.service';
export declare const COMMISSION_QUEUE: "commissions";
export declare const COMMISSION_SWEEP_JOB = "commission-eligibility-sweep";
/**
 * Dependency direction is deliberately one-way:
 *   WebhooksModule -> PaymentsModule -> AffiliateModule
 * AffiliateModule imports only PrismaModule + NotificationsModule (AuditModule and
 * QueuesModule are @Global), so no forwardRef is required anywhere.
 */
export declare class AffiliateModule implements OnModuleInit {
    private readonly queueService;
    private readonly sweepService;
    constructor(queueService: QueueService, sweepService: CommissionSweepService);
    /**
     * Registers the eligibility sweep as a BullMQ repeatable job.
     * When Redis is not configured QueueService is a no-op — the sweep simply does not
     * run automatically, and operators use POST /admin/affiliate/settings/run-sweep.
     */
    onModuleInit(): Promise<void>;
}

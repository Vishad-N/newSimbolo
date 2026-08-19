"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CommissionSweepService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionSweepService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_service_1 = require("../../shared/abstractions/base.service");
const notifications_service_1 = require("../../notifications/notifications.service");
const affiliate_settings_service_1 = require("./affiliate-settings.service");
const commission_service_1 = require("./commission.service");
const withdrawal_service_1 = require("./withdrawal.service");
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
let CommissionSweepService = class CommissionSweepService extends base_service_1.BaseService {
    static { CommissionSweepService_1 = this; }
    prisma;
    settingsService;
    commissionService;
    withdrawalService;
    notifications;
    static BATCH_SIZE = 200;
    constructor(prisma, settingsService, commissionService, withdrawalService, notifications) {
        super('CommissionSweepService');
        this.prisma = prisma;
        this.settingsService = settingsService;
        this.commissionService = commissionService;
        this.withdrawalService = withdrawalService;
        this.notifications = notifications;
    }
    async run() {
        const now = new Date();
        const settings = await this.settingsService.get();
        const result = {
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
                status: client_1.CommissionStatusEnum.PENDING,
                eligibleAt: { not: null, lte: now },
            },
            select: { id: true, commissionAmount: true, affiliate: { select: { userId: true } } },
            take: CommissionSweepService_1.BATCH_SIZE,
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
            }
            catch (error) {
                result.failedCommissions += 1;
                this.logger.error(`Sweep failed to credit commission ${commission.id}: ${error.message}`);
            }
        }
        // Also pick up commissions already promoted to ELIGIBLE by an earlier partial run.
        const eligible = await this.prisma.commission.findMany({
            where: { status: client_1.CommissionStatusEnum.ELIGIBLE },
            select: { id: true, commissionAmount: true, affiliate: { select: { userId: true } } },
            take: CommissionSweepService_1.BATCH_SIZE,
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
            }
            catch (error) {
                result.failedCommissions += 1;
                this.logger.error(`Sweep failed to credit commission ${commission.id}: ${error.message}`);
            }
        }
        // (b) Auto-payout of scheduled withdrawals, if enabled.
        if (settings.payoutAutoProcessingEnabled) {
            const scheduled = await this.prisma.withdrawal.findMany({
                where: {
                    status: client_1.WithdrawalStatusEnum.SCHEDULED,
                    scheduledAt: { not: null, lte: now },
                },
                select: { id: true },
                take: CommissionSweepService_1.BATCH_SIZE,
                orderBy: { scheduledAt: 'asc' },
            });
            result.scannedWithdrawals = scheduled.length;
            for (const withdrawal of scheduled) {
                try {
                    await this.withdrawalService.process(withdrawal.id);
                    result.processedWithdrawals += 1;
                }
                catch (error) {
                    result.failedWithdrawals += 1;
                    this.logger.error(`Sweep failed to process withdrawal ${withdrawal.id}: ${error.message}`);
                }
            }
        }
        this.logger.log(`Commission sweep complete — credited ${result.creditedCommissions}/${result.scannedCommissions} commissions, ` +
            `processed ${result.processedWithdrawals}/${result.scannedWithdrawals} withdrawals`);
        return result;
    }
};
exports.CommissionSweepService = CommissionSweepService;
exports.CommissionSweepService = CommissionSweepService = CommissionSweepService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        affiliate_settings_service_1.AffiliateSettingsService,
        commission_service_1.CommissionService,
        withdrawal_service_1.WithdrawalService,
        notifications_service_1.NotificationsService])
], CommissionSweepService);
//# sourceMappingURL=commission-sweep.service.js.map
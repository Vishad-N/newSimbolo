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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateModule = exports.COMMISSION_SWEEP_JOB = exports.COMMISSION_QUEUE = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
const queue_service_1 = require("../queues/queue.service");
const affiliate_checkout_controller_1 = require("./controllers/affiliate-checkout.controller");
const affiliate_me_controller_1 = require("./controllers/affiliate-me.controller");
const admin_affiliate_controller_1 = require("./controllers/admin-affiliate.controller");
const razorpayx_webhook_controller_1 = require("./controllers/razorpayx-webhook.controller");
const affiliate_settings_service_1 = require("./services/affiliate-settings.service");
const affiliate_service_1 = require("./services/affiliate.service");
const commission_service_1 = require("./services/commission.service");
const commission_sweep_service_1 = require("./services/commission-sweep.service");
const payout_method_service_1 = require("./services/payout-method.service");
const razorpayx_provider_1 = require("./services/razorpayx.provider");
const wallet_service_1 = require("./services/wallet.service");
const withdrawal_service_1 = require("./services/withdrawal.service");
exports.COMMISSION_QUEUE = 'commissions';
exports.COMMISSION_SWEEP_JOB = 'commission-eligibility-sweep';
const SWEEP_INTERVAL_MS = 15 * 60 * 1000;
/**
 * Dependency direction is deliberately one-way:
 *   WebhooksModule -> PaymentsModule -> AffiliateModule
 * AffiliateModule imports only PrismaModule + NotificationsModule (AuditModule and
 * QueuesModule are @Global), so no forwardRef is required anywhere.
 */
let AffiliateModule = class AffiliateModule {
    queueService;
    sweepService;
    constructor(queueService, sweepService) {
        this.queueService = queueService;
        this.sweepService = sweepService;
    }
    /**
     * Registers the eligibility sweep as a BullMQ repeatable job.
     * When Redis is not configured QueueService is a no-op — the sweep simply does not
     * run automatically, and operators use POST /admin/affiliate/settings/run-sweep.
     */
    async onModuleInit() {
        this.queueService.registerWorker(exports.COMMISSION_QUEUE, async () => {
            await this.sweepService.run();
        });
        await this.queueService.add(exports.COMMISSION_QUEUE, exports.COMMISSION_SWEEP_JOB, {}, { repeat: { every: SWEEP_INTERVAL_MS }, jobId: exports.COMMISSION_SWEEP_JOB });
    }
};
exports.AffiliateModule = AffiliateModule;
exports.AffiliateModule = AffiliateModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule],
        controllers: [
            affiliate_checkout_controller_1.AffiliateCheckoutController,
            affiliate_me_controller_1.AffiliateMeController,
            admin_affiliate_controller_1.AdminAffiliateController,
            razorpayx_webhook_controller_1.RazorpayXWebhookController,
        ],
        providers: [
            affiliate_service_1.AffiliateService,
            affiliate_settings_service_1.AffiliateSettingsService,
            commission_service_1.CommissionService,
            wallet_service_1.WalletService,
            payout_method_service_1.PayoutMethodService,
            withdrawal_service_1.WithdrawalService,
            commission_sweep_service_1.CommissionSweepService,
            razorpayx_provider_1.RazorpayXGateway,
        ],
        exports: [
            affiliate_service_1.AffiliateService,
            affiliate_settings_service_1.AffiliateSettingsService,
            commission_service_1.CommissionService,
            wallet_service_1.WalletService,
            withdrawal_service_1.WithdrawalService,
            commission_sweep_service_1.CommissionSweepService,
        ],
    }),
    __metadata("design:paramtypes", [queue_service_1.QueueService,
        commission_sweep_service_1.CommissionSweepService])
], AffiliateModule);
//# sourceMappingURL=affiliate.module.js.map
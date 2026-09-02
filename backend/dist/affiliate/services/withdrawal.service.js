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
var WithdrawalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_service_1 = require("../../shared/abstractions/base.service");
const audit_service_1 = require("../../shared/audit/audit.service");
const notifications_service_1 = require("../../notifications/notifications.service");
const razorpayx_provider_1 = require("./razorpayx.provider");
const wallet_service_1 = require("./wallet.service");
let WithdrawalService = class WithdrawalService extends base_service_1.BaseService {
    static { WithdrawalService_1 = this; }
    prisma;
    walletService;
    razorpayx;
    auditService;
    notifications;
    constructor(prisma, walletService, razorpayx, auditService, notifications) {
        super('WithdrawalService');
        this.prisma = prisma;
        this.walletService = walletService;
        this.razorpayx = razorpayx;
        this.auditService = auditService;
        this.notifications = notifications;
    }
    // ── Employee-facing ───────────────────────────────────────────────────────
    async requestWithdrawal(affiliateId, dto, actorUserId) {
        return this.walletService.reserveWithdrawal(affiliateId, dto.amount, {
            payoutMethodId: dto.payoutMethodId,
            actorUserId,
        });
    }
    static ADMIN_WITHDRAWAL_INCLUDE = {
        payoutMethod: { select: { id: true, type: true, maskedDetails: true, last4: true } },
        affiliate: {
            select: {
                id: true,
                affiliateCode: true,
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        },
    };
    /** Flattens the nested Prisma row into the shape the admin withdrawals table renders. */
    toAdminRow(w) {
        const name = [w.affiliate.user.firstName, w.affiliate.user.lastName].filter(Boolean).join(' ') || w.affiliate.user.email;
        return {
            id: w.id,
            affiliateId: w.affiliateId,
            employeeName: name,
            employeeCode: w.affiliate.affiliateCode,
            amount: w.amount,
            status: w.status,
            requestedAt: w.requestedAt,
            scheduledAt: w.scheduledAt,
            processedAt: w.processedAt,
            payoutMethod: w.payoutMethod ? `${w.payoutMethod.type} •••• ${w.payoutMethod.last4 ?? ''}`.trim() : null,
            razorpayPayoutId: w.razorpayPayoutId,
            failureReason: w.failureReason,
        };
    }
    async list(params) {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const where = {};
        if (params.affiliateId)
            where.affiliateId = params.affiliateId;
        if (params.status)
            where.status = params.status;
        const [rows, total] = await Promise.all([
            this.prisma.withdrawal.findMany({
                where,
                include: WithdrawalService_1.ADMIN_WITHDRAWAL_INCLUDE,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { requestedAt: 'desc' },
            }),
            this.prisma.withdrawal.count({ where }),
        ]);
        return { data: rows.map((r) => this.toAdminRow(r)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id, scopeAffiliateId) {
        const withdrawal = await this.prisma.withdrawal.findFirst({
            where: { id, ...(scopeAffiliateId ? { affiliateId: scopeAffiliateId } : {}) },
            include: WithdrawalService_1.ADMIN_WITHDRAWAL_INCLUDE,
        });
        if (!withdrawal)
            throw new common_1.NotFoundException(`Withdrawal ${id} not found`);
        return this.toAdminRow(withdrawal);
    }
    // ── Admin actions ─────────────────────────────────────────────────────────
    /** PENDING -> SCHEDULED. Funds stay held; the sweep or an admin then processes it. */
    async approve(id, actorUserId) {
        const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!withdrawal)
            throw new common_1.NotFoundException(`Withdrawal ${id} not found`);
        if (withdrawal.status !== client_1.WithdrawalStatusEnum.PENDING) {
            throw new common_1.BadRequestException(`Only PENDING withdrawals can be approved (current: ${withdrawal.status})`);
        }
        const updated = await this.prisma.withdrawal.update({
            where: { id },
            data: { status: client_1.WithdrawalStatusEnum.SCHEDULED, scheduledAt: new Date() },
        });
        await this.auditService.logEvent({
            action: 'withdrawal.approved',
            entityType: 'Withdrawal',
            entityId: id,
            oldValue: { status: withdrawal.status },
            newValue: { status: updated.status },
            userId: actorUserId,
        });
        return updated;
    }
    /**
     * Initiates the actual RazorpayX payout.
     *
     * Ordering matters: the withdrawal is flipped to PROCESSING BEFORE the gateway
     * call, so that a crash mid-call leaves the row in a state that can only be
     * resolved by a webhook or an explicit admin retry — never silently re-payable.
     * The idempotency key is derived from the withdrawal id, so a retried gateway
     * call for the same withdrawal cannot disburse twice.
     */
    async process(id, actorUserId) {
        const withdrawal = await this.prisma.withdrawal.findUnique({
            where: { id },
            include: { payoutMethod: true, affiliate: { select: { userId: true } } },
        });
        if (!withdrawal)
            throw new common_1.NotFoundException(`Withdrawal ${id} not found`);
        const processable = [client_1.WithdrawalStatusEnum.PENDING, client_1.WithdrawalStatusEnum.SCHEDULED];
        if (!processable.includes(withdrawal.status)) {
            throw new common_1.BadRequestException(`Withdrawal cannot be processed from status ${withdrawal.status}`);
        }
        if (!withdrawal.payoutMethod?.razorpayFundAccountId) {
            throw new common_1.BadRequestException('Withdrawal has no linked RazorpayX fund account');
        }
        // Conditional transition — guards against two admins clicking "process" at once.
        const claimed = await this.prisma.withdrawal.updateMany({
            where: { id, status: withdrawal.status },
            data: { status: client_1.WithdrawalStatusEnum.PROCESSING },
        });
        if (claimed.count !== 1) {
            throw new common_1.BadRequestException('Withdrawal is already being processed');
        }
        try {
            const payout = await this.razorpayx.createPayout(withdrawal.id, withdrawal.amount, withdrawal.payoutMethod.razorpayFundAccountId, `withdrawal_${withdrawal.id}`);
            const updated = await this.prisma.withdrawal.update({
                where: { id },
                data: {
                    razorpayPayoutId: payout.payoutId,
                    razorpayContactId: withdrawal.payoutMethod.razorpayContactId,
                    razorpayFundAccountId: withdrawal.payoutMethod.razorpayFundAccountId,
                    metadata: { gatewayStatus: payout.status },
                },
            });
            await this.auditService.logEvent({
                action: 'withdrawal.processing',
                entityType: 'Withdrawal',
                entityId: id,
                oldValue: { status: withdrawal.status },
                newValue: { status: client_1.WithdrawalStatusEnum.PROCESSING, razorpayPayoutId: payout.payoutId },
                userId: actorUserId,
            });
            return updated;
        }
        catch (error) {
            const reason = error.message ?? 'Payout initiation failed';
            this.logger.error(`Payout initiation failed for withdrawal ${id}: ${reason}`);
            // Return the held funds — the gateway never accepted the payout.
            await this.walletService.releaseWithdrawalHold(id, reason, { actorUserId });
            await this.notifyFailure(withdrawal.affiliate.userId, withdrawal.amount, reason);
            throw new common_1.BadRequestException(`Payout initiation failed: ${reason}`);
        }
    }
    /** Retries a FAILED withdrawal by re-reserving funds and re-initiating the payout. */
    async retry(id, actorUserId) {
        const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!withdrawal)
            throw new common_1.NotFoundException(`Withdrawal ${id} not found`);
        if (withdrawal.status !== client_1.WithdrawalStatusEnum.FAILED) {
            throw new common_1.BadRequestException(`Only FAILED withdrawals can be retried (current: ${withdrawal.status})`);
        }
        // The original hold was released on failure, so a retry must re-reserve funds.
        const fresh = await this.walletService.reserveWithdrawal(withdrawal.affiliateId, withdrawal.amount, {
            payoutMethodId: withdrawal.payoutMethodId ?? undefined,
            actorUserId,
        });
        await this.auditService.logEvent({
            action: 'withdrawal.retried',
            entityType: 'Withdrawal',
            entityId: fresh.id,
            oldValue: { retriedFromWithdrawalId: id },
            newValue: { status: fresh.status, amount: fresh.amount },
            userId: actorUserId,
        });
        return this.process(fresh.id, actorUserId);
    }
    /** Cancels a still-held withdrawal and returns the funds to the available balance. */
    async cancel(id, reason, actorUserId) {
        const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id } });
        if (!withdrawal)
            throw new common_1.NotFoundException(`Withdrawal ${id} not found`);
        const cancellable = [
            client_1.WithdrawalStatusEnum.PENDING,
            client_1.WithdrawalStatusEnum.SCHEDULED,
            client_1.WithdrawalStatusEnum.FAILED,
        ];
        if (!cancellable.includes(withdrawal.status)) {
            throw new common_1.BadRequestException(`Withdrawal cannot be cancelled from status ${withdrawal.status}`);
        }
        await this.walletService.releaseWithdrawalHold(id, reason || 'Cancelled by admin', {
            finalStatus: client_1.WithdrawalStatusEnum.CANCELLED,
            actorUserId,
        });
        return this.prisma.withdrawal.findUniqueOrThrow({ where: { id } });
    }
    // ── Webhook-driven transitions ────────────────────────────────────────────
    async findByRazorpayPayoutId(payoutId) {
        return this.prisma.withdrawal.findFirst({
            where: { razorpayPayoutId: payoutId },
            include: { affiliate: { select: { userId: true } } },
        });
    }
    async markPaidFromWebhook(withdrawalId, payoutId, notifyUserId, amount) {
        const result = await this.walletService.debitWithdrawalOnPaid(withdrawalId, { razorpayPayoutId: payoutId });
        if (result.debited) {
            await this.notifications.notifyWithdrawalProcessed(notifyUserId, amount).catch(() => undefined);
        }
        return result;
    }
    async markFailedFromWebhook(withdrawalId, reason, notifyUserId, amount) {
        const result = await this.walletService.releaseWithdrawalHold(withdrawalId, reason);
        await this.notifyFailure(notifyUserId, amount, reason);
        return result;
    }
    async notifyFailure(userId, amount, reason) {
        await this.notifications.notifyWithdrawalFailed(userId, amount, reason).catch(() => undefined);
    }
};
exports.WithdrawalService = WithdrawalService;
exports.WithdrawalService = WithdrawalService = WithdrawalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        razorpayx_provider_1.RazorpayXGateway,
        audit_service_1.AuditService,
        notifications_service_1.NotificationsService])
], WithdrawalService);
//# sourceMappingURL=withdrawal.service.js.map
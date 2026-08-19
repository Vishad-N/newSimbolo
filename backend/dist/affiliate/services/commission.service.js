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
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_service_1 = require("../../shared/abstractions/base.service");
const audit_service_1 = require("../../shared/audit/audit.service");
const money_util_1 = require("../utils/money.util");
const wallet_service_1 = require("./wallet.service");
let CommissionService = class CommissionService extends base_service_1.BaseService {
    prisma;
    walletService;
    auditService;
    constructor(prisma, walletService, auditService) {
        super('CommissionService');
        this.prisma = prisma;
        this.walletService = walletService;
        this.auditService = auditService;
    }
    /**
     * Maps a calculation basis onto the Order's monetary columns.
     *
     * The schema does not spell these out, so the mapping is documented here and is
     * the single place it is defined:
     *   SUBTOTAL                -> order.totalAmount                     (gross list price)
     *   SUBTOTAL_AFTER_DISCOUNT -> order.totalAmount - order.discountAmount
     *   TAXABLE_AMOUNT          -> order.netAmount                       (post-discount taxable base)
     *   GRAND_TOTAL             -> order.netAmount + order.taxAmount      (what the customer pays)
     */
    computeCommissionBase(order, basis) {
        switch (basis) {
            case client_1.CommissionCalculationBasisEnum.SUBTOTAL:
                return (0, money_util_1.roundCurrency)(order.totalAmount);
            case client_1.CommissionCalculationBasisEnum.SUBTOTAL_AFTER_DISCOUNT:
                return (0, money_util_1.roundCurrency)(order.totalAmount - order.discountAmount);
            case client_1.CommissionCalculationBasisEnum.TAXABLE_AMOUNT:
                return (0, money_util_1.roundCurrency)(order.netAmount);
            case client_1.CommissionCalculationBasisEnum.GRAND_TOTAL:
                return (0, money_util_1.roundCurrency)(order.netAmount + order.taxAmount);
            default:
                return (0, money_util_1.roundCurrency)(order.netAmount);
        }
    }
    /**
     * Computes and FREEZES the commission for an order at payment-preparation time.
     *
     * "Freeze" semantics: every monetary input is derived from DB rows (Order,
     * Affiliate, AffiliateSettings) — nothing comes from the request body — and once
     * the payment succeeds the row is never recalculated, even if the rate, basis or
     * the employee's status later changes.
     *
     * Keyed on the [orderId, affiliateId] unique pair, so re-preparing a payment for
     * the same order + employee updates the frozen figures in place. If the row has
     * already advanced past PENDING, the payment already succeeded and this is a
     * stale re-prepare — reject rather than mutate settled money.
     */
    async resolveAndFreezeCommission(order, affiliate, settings) {
        const basis = affiliate.commissionBasisDefault ?? settings.commissionCalculationBasis;
        const rate = affiliate.commissionRate;
        const commissionBaseAmount = this.computeCommissionBase(order, basis);
        const commissionAmount = (0, money_util_1.roundCurrency)((commissionBaseAmount * rate) / 100);
        const existing = await this.prisma.commission.findUnique({
            where: { orderId_affiliateId: { orderId: order.id, affiliateId: affiliate.id } },
        });
        if (existing && existing.status !== client_1.CommissionStatusEnum.PENDING) {
            throw new common_1.BadRequestException('A settled commission already exists for this order — payment cannot be re-prepared');
        }
        if (existing && existing.paymentId) {
            throw new common_1.BadRequestException('A commission is already linked to a payment for this order — payment cannot be re-prepared');
        }
        // If the customer switched employee codes before paying, retire the previous
        // still-PENDING attribution so only one commission can ever settle per order.
        await this.prisma.commission.updateMany({
            where: {
                orderId: order.id,
                affiliateId: { not: affiliate.id },
                status: client_1.CommissionStatusEnum.PENDING,
                paymentId: null,
            },
            data: { status: client_1.CommissionStatusEnum.CANCELLED },
        });
        const commission = await this.prisma.commission.upsert({
            where: { orderId_affiliateId: { orderId: order.id, affiliateId: affiliate.id } },
            create: {
                orderId: order.id,
                affiliateId: affiliate.id,
                employeeCodeSnapshot: affiliate.affiliateCode,
                commissionRate: rate,
                commissionBaseAmount,
                commissionAmount,
                calculationBasis: basis,
                currency: order.currency ?? 'INR',
                status: client_1.CommissionStatusEnum.PENDING,
                paymentId: null,
                metadata: {
                    orderSnapshot: {
                        totalAmount: order.totalAmount,
                        discountAmount: order.discountAmount,
                        netAmount: order.netAmount,
                        taxAmount: order.taxAmount,
                    },
                },
            },
            update: {
                employeeCodeSnapshot: affiliate.affiliateCode,
                commissionRate: rate,
                commissionBaseAmount,
                commissionAmount,
                calculationBasis: basis,
                currency: order.currency ?? 'INR',
                metadata: {
                    orderSnapshot: {
                        totalAmount: order.totalAmount,
                        discountAmount: order.discountAmount,
                        netAmount: order.netAmount,
                        taxAmount: order.taxAmount,
                    },
                },
            },
        });
        await this.auditService.logEvent({
            action: 'commission.frozen',
            entityType: 'Commission',
            entityId: commission.id,
            newValue: {
                orderId: order.id,
                affiliateId: affiliate.id,
                employeeCode: affiliate.affiliateCode,
                basis,
                rate,
                commissionBaseAmount,
                commissionAmount,
            },
        });
        return commission;
    }
    /** Links the frozen commission to the Payment row once the gateway order exists. */
    attachPaymentOp(tx, commissionId, paymentId) {
        return tx.commission.update({
            where: { id: commissionId },
            data: { paymentId },
        });
    }
    /**
     * Called from inside the successful /payments/verify transaction.
     *
     * - hold period 0  -> credit immediately (status goes straight to CREDITED)
     * - hold period > 0 -> stay PENDING, record when it becomes ELIGIBLE
     *
     * NOTE (intentional design choice): if the employee was deactivated AFTER the
     * payment order was created but BEFORE verification, the commission still settles.
     * It was validated and frozen while the code was valid and the customer already
     * had a live gateway order; retroactively voiding it would break freeze semantics.
     */
    async settleCommissionOnPaymentSuccess(tx, orderId, settings) {
        const commission = await tx.commission.findFirst({
            where: { orderId, status: client_1.CommissionStatusEnum.PENDING },
        });
        if (!commission)
            return null;
        const now = new Date();
        if (settings.commissionHoldPeriodDays <= 0) {
            await tx.commission.update({
                where: { id: commission.id },
                data: { eligibleAt: now },
            });
            const result = await this.walletService.creditCommissionWithin(tx, commission.id);
            const refreshed = await tx.commission.findUniqueOrThrow({ where: { id: commission.id } });
            return { commission: refreshed, credited: result.credited };
        }
        const eligibleAt = new Date(now.getTime() + settings.commissionHoldPeriodDays * 24 * 60 * 60 * 1000);
        const updated = await tx.commission.update({
            where: { id: commission.id },
            data: { eligibleAt },
        });
        return { commission: updated, credited: false };
    }
    /** Promotes a PENDING + due commission to ELIGIBLE. Used by the sweep. */
    async promoteEligibleToCredited(commissionId) {
        const commission = await this.prisma.commission.findUnique({ where: { id: commissionId } });
        if (!commission)
            throw new common_1.NotFoundException(`Commission ${commissionId} not found`);
        if (commission.status === client_1.CommissionStatusEnum.PENDING) {
            await this.prisma.commission.updateMany({
                where: { id: commissionId, status: client_1.CommissionStatusEnum.PENDING },
                data: { status: client_1.CommissionStatusEnum.ELIGIBLE },
            });
        }
        return this.walletService.creditCommission(commissionId);
    }
    /**
     * Refund hook. `reversalAmount` is proportional for partial refunds:
     *   commissionAmount * (refundAmount / orderTotalAmount)
     * A full refund (refundAmount === orderTotalAmount) therefore reverses in full.
     */
    async reverseCommission(orderId, refundAmount, orderTotalAmount) {
        const commission = await this.prisma.commission.findFirst({
            where: { orderId, status: { notIn: [client_1.CommissionStatusEnum.CANCELLED] } },
            orderBy: { createdAt: 'desc' },
        });
        if (!commission)
            return { reversed: false, reason: 'no-commission' };
        // Defensive idempotency on top of the webhook-level guard.
        if (commission.status === client_1.CommissionStatusEnum.REVERSED) {
            this.logger.log(`Commission ${commission.id} already reversed — skipping`);
            return { reversed: false, reason: 'already-reversed' };
        }
        if (!orderTotalAmount || orderTotalAmount <= 0) {
            this.logger.warn(`Cannot compute reversal ratio for order ${orderId} (total ${orderTotalAmount})`);
            return { reversed: false, reason: 'invalid-order-total' };
        }
        const ratio = Math.min(Math.max(refundAmount / orderTotalAmount, 0), 1);
        const reversalAmount = (0, money_util_1.roundCurrency)(commission.commissionAmount * ratio);
        const result = await this.walletService.applyCommissionReversal(commission.id, reversalAmount, {
            reason: `Refund of ₹${refundAmount} on order ${orderId} (${Math.round(ratio * 100)}%)`,
        });
        return { reversed: result.reversed };
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallet_service_1.WalletService,
        audit_service_1.AuditService])
], CommissionService);
//# sourceMappingURL=commission.service.js.map
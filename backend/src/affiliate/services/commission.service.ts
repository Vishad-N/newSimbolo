import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  Affiliate,
  AffiliateSettings,
  Commission,
  CommissionCalculationBasisEnum,
  CommissionStatusEnum,
  Order,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { roundCurrency } from '../utils/money.util';
import { PrismaTx, WalletService } from './wallet.service';

@Injectable()
export class CommissionService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly auditService: AuditService,
  ) {
    super('CommissionService');
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
  computeCommissionBase(order: Pick<Order, 'totalAmount' | 'discountAmount' | 'netAmount' | 'taxAmount'>, basis: CommissionCalculationBasisEnum): number {
    switch (basis) {
      case CommissionCalculationBasisEnum.SUBTOTAL:
        return roundCurrency(order.totalAmount);
      case CommissionCalculationBasisEnum.SUBTOTAL_AFTER_DISCOUNT:
        return roundCurrency(order.totalAmount - order.discountAmount);
      case CommissionCalculationBasisEnum.TAXABLE_AMOUNT:
        return roundCurrency(order.netAmount);
      case CommissionCalculationBasisEnum.GRAND_TOTAL:
        return roundCurrency(order.netAmount + order.taxAmount);
      default:
        return roundCurrency(order.netAmount);
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
  async resolveAndFreezeCommission(
    order: Order,
    affiliate: Affiliate,
    settings: AffiliateSettings,
  ): Promise<Commission> {
    const basis = affiliate.commissionBasisDefault ?? settings.commissionCalculationBasis;
    const rate = affiliate.commissionRate;
    const commissionBaseAmount = this.computeCommissionBase(order, basis);
    const commissionAmount = roundCurrency((commissionBaseAmount * rate) / 100);

    const existing = await this.prisma.commission.findUnique({
      where: { orderId_affiliateId: { orderId: order.id, affiliateId: affiliate.id } },
    });

    if (existing && existing.status !== CommissionStatusEnum.PENDING) {
      throw new BadRequestException(
        'A settled commission already exists for this order — payment cannot be re-prepared',
      );
    }
    if (existing && existing.paymentId) {
      throw new BadRequestException(
        'A commission is already linked to a payment for this order — payment cannot be re-prepared',
      );
    }

    // If the customer switched employee codes before paying, retire the previous
    // still-PENDING attribution so only one commission can ever settle per order.
    await this.prisma.commission.updateMany({
      where: {
        orderId: order.id,
        affiliateId: { not: affiliate.id },
        status: CommissionStatusEnum.PENDING,
        paymentId: null,
      },
      data: { status: CommissionStatusEnum.CANCELLED },
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
        status: CommissionStatusEnum.PENDING,
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
  attachPaymentOp(tx: PrismaTx, commissionId: string, paymentId: string) {
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
  async settleCommissionOnPaymentSuccess(
    tx: PrismaTx,
    orderId: string,
    settings: AffiliateSettings,
  ): Promise<{ commission: Commission; credited: boolean } | null> {
    const commission = await tx.commission.findFirst({
      where: { orderId, status: CommissionStatusEnum.PENDING },
    });
    if (!commission) return null;

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
  async promoteEligibleToCredited(commissionId: string): Promise<{ credited: boolean }> {
    const commission = await this.prisma.commission.findUnique({ where: { id: commissionId } });
    if (!commission) throw new NotFoundException(`Commission ${commissionId} not found`);

    if (commission.status === CommissionStatusEnum.PENDING) {
      await this.prisma.commission.updateMany({
        where: { id: commissionId, status: CommissionStatusEnum.PENDING },
        data: { status: CommissionStatusEnum.ELIGIBLE },
      });
    }

    return this.walletService.creditCommission(commissionId);
  }

  /**
   * Refund hook. `reversalAmount` is proportional for partial refunds:
   *   commissionAmount * (refundAmount / orderTotalAmount)
   * A full refund (refundAmount === orderTotalAmount) therefore reverses in full.
   */
  async reverseCommission(
    orderId: string,
    refundAmount: number,
    orderTotalAmount: number,
  ): Promise<{ reversed: boolean; reason?: string }> {
    const commission = await this.prisma.commission.findFirst({
      where: { orderId, status: { notIn: [CommissionStatusEnum.CANCELLED] } },
      orderBy: { createdAt: 'desc' },
    });

    if (!commission) return { reversed: false, reason: 'no-commission' };

    // Defensive idempotency on top of the webhook-level guard.
    if (commission.status === CommissionStatusEnum.REVERSED) {
      this.logger.log(`Commission ${commission.id} already reversed — skipping`);
      return { reversed: false, reason: 'already-reversed' };
    }

    if (!orderTotalAmount || orderTotalAmount <= 0) {
      this.logger.warn(`Cannot compute reversal ratio for order ${orderId} (total ${orderTotalAmount})`);
      return { reversed: false, reason: 'invalid-order-total' };
    }

    const ratio = Math.min(Math.max(refundAmount / orderTotalAmount, 0), 1);
    const reversalAmount = roundCurrency(commission.commissionAmount * ratio);

    const result = await this.walletService.applyCommissionReversal(commission.id, reversalAmount, {
      reason: `Refund of ₹${refundAmount} on order ${orderId} (${Math.round(ratio * 100)}%)`,
    });

    return { reversed: result.reversed };
  }
}

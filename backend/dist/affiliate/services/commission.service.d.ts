import { Affiliate, AffiliateSettings, Commission, CommissionCalculationBasisEnum, Order } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { PrismaTx, WalletService } from './wallet.service';
export declare class CommissionService extends BaseService {
    private readonly prisma;
    private readonly walletService;
    private readonly auditService;
    constructor(prisma: PrismaService, walletService: WalletService, auditService: AuditService);
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
    computeCommissionBase(order: Pick<Order, 'totalAmount' | 'discountAmount' | 'netAmount' | 'taxAmount'>, basis: CommissionCalculationBasisEnum): number;
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
    resolveAndFreezeCommission(order: Order, affiliate: Affiliate, settings: AffiliateSettings): Promise<Commission>;
    /** Links the frozen commission to the Payment row once the gateway order exists. */
    attachPaymentOp(tx: PrismaTx, commissionId: string, paymentId: string): import(".prisma/client").Prisma.Prisma__CommissionClient<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.CommissionStatusEnum;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        currency: string;
        orderId: string;
        paymentId: string | null;
        affiliateId: string;
        commissionRate: number;
        commissionAmount: number;
        commissionBaseAmount: number;
        reversedAmount: number | null;
        employeeCodeSnapshot: string;
        calculationBasis: import(".prisma/client").$Enums.CommissionCalculationBasisEnum;
        eligibleAt: Date | null;
        creditedAt: Date | null;
        reversedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
    settleCommissionOnPaymentSuccess(tx: PrismaTx, orderId: string, settings: AffiliateSettings): Promise<{
        commission: Commission;
        credited: boolean;
    } | null>;
    /** Promotes a PENDING + due commission to ELIGIBLE. Used by the sweep. */
    promoteEligibleToCredited(commissionId: string): Promise<{
        credited: boolean;
    }>;
    /**
     * Refund hook. `reversalAmount` is proportional for partial refunds:
     *   commissionAmount * (refundAmount / orderTotalAmount)
     * A full refund (refundAmount === orderTotalAmount) therefore reverses in full.
     */
    reverseCommission(orderId: string, refundAmount: number, orderTotalAmount: number): Promise<{
        reversed: boolean;
        reason?: string;
    }>;
}

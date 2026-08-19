import { Prisma, Wallet, Withdrawal, WithdrawalStatusEnum } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { AffiliateSettingsService } from './affiliate-settings.service';
export type PrismaTx = Prisma.TransactionClient;
export interface WalletBalances {
    availableBalance: number;
    pendingBalance: number;
    lifetimeEarned: number;
    lifetimeWithdrawn: number;
}
/**
 * Wallet ledger.
 *
 * INVARIANTS (do not break these):
 *  1. Every balance mutation is accompanied by exactly one WalletTransaction row,
 *     written in the SAME database transaction as the balance update.
 *  2. Balance updates use optimistic concurrency via `Wallet.version` — the update
 *     is a conditional `updateMany` on the version we read; a 0-row result means a
 *     concurrent writer won and we retry from a fresh read.
 *  3. All monetary arithmetic goes through roundCurrency().
 *  4. Every state transition is idempotent: replaying a webhook or re-running the
 *     sweep must never double-credit or double-debit.
 */
export declare class WalletService extends BaseService {
    private readonly prisma;
    private readonly auditService;
    private readonly settingsService;
    private static readonly MAX_RETRIES;
    constructor(prisma: PrismaService, auditService: AuditService, settingsService: AffiliateSettingsService);
    /**
     * Reads a wallet, computes new balances via `compute`, and applies them with an
     * optimistic version check. Returns the before/after snapshots so the caller can
     * build the matching ledger entry inside the SAME transaction.
     *
     * Throws ConflictException when the version check fails — the caller either
     * retries (standalone path via `withOptimisticRetry`) or lets its enclosing
     * transaction roll back.
     */
    private applyWalletMutation;
    /** Runs a transactional unit of work, retrying only on optimistic-lock conflicts. */
    private withOptimisticRetry;
    getWalletByAffiliateId(affiliateId: string): Promise<Wallet>;
    listTransactions(walletId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.WalletTransactionTypeEnum;
            description: string | null;
            metadata: Prisma.JsonValue | null;
            amount: number;
            walletId: string;
            balanceBefore: number;
            balanceAfter: number;
            referenceType: string;
            referenceId: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    /**
     * Credits an ELIGIBLE (or, when the hold period is 0, PENDING) commission into the
     * affiliate's wallet. Idempotent — an already-CREDITED commission is a no-op.
     */
    creditCommission(commissionId: string): Promise<{
        credited: boolean;
    }>;
    /**
     * Single-attempt, transaction-scoped credit. Use this when you already hold a
     * Prisma transaction (e.g. inside /payments/verify with a 0-day hold period).
     */
    creditCommissionWithin(tx: PrismaTx, commissionId: string): Promise<{
        credited: boolean;
        amount: number;
        walletId?: string;
    }>;
    /**
     * Moves `amount` from availableBalance to pendingBalance and creates a PENDING
     * Withdrawal in the same transaction.
     */
    reserveWithdrawal(affiliateId: string, amount: number, options?: {
        payoutMethodId?: string;
        actorUserId?: string;
    }): Promise<Withdrawal>;
    /**
     * Returns held funds to availableBalance and marks the withdrawal FAILED (or
     * CANCELLED when explicitly cancelled by an admin/employee).
     * Idempotent: terminal states (PAID/CANCELLED/REVERSED) are skipped.
     */
    releaseWithdrawalHold(withdrawalId: string, reason: string, options?: {
        finalStatus?: WithdrawalStatusEnum;
        actorUserId?: string;
    }): Promise<{
        released: boolean;
    }>;
    /**
     * Finalises a successful payout. Only a PROCESSING withdrawal may be debited —
     * this is the idempotency guard against a payout webhook firing twice.
     */
    debitWithdrawalOnPaid(withdrawalId: string, options?: {
        razorpayPayoutId?: string;
        actorUserId?: string;
    }): Promise<{
        debited: boolean;
    }>;
    /**
     * Reverses a commission after a full/partial refund.
     *
     * If nothing was credited yet (PENDING/ELIGIBLE) the commission is simply marked
     * REVERSED — no wallet movement is required because no funds ever landed.
     *
     * If the commission was already CREDITED, availableBalance is reduced. This CAN
     * push the wallet negative, which is intentional: it represents a real clawback
     * liability when the affiliate has already withdrawn the money. Clamping at zero
     * would silently destroy that liability, so we record it (and flag it in the
     * ledger metadata) instead.
     */
    applyCommissionReversal(commissionId: string, reversalAmount: number, options?: {
        reason?: string;
        actorUserId?: string;
    }): Promise<{
        reversed: boolean;
        causedNegativeBalance: boolean;
    }>;
    /**
     * Payout reversal from RazorpayX (`payout.reversed`): money never left the bank,
     * so the funds go back to availableBalance and the withdrawal is marked REVERSED.
     */
    reverseWithdrawalPayout(withdrawalId: string, reason: string): Promise<{
        reversed: boolean;
    }>;
}

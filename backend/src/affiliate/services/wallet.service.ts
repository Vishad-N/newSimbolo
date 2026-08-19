import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AffiliateStatusEnum,
  CommissionStatusEnum,
  PayoutMethodStatusEnum,
  Prisma,
  Wallet,
  WalletTransactionTypeEnum,
  Withdrawal,
  WithdrawalStatusEnum,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { roundCurrency } from '../utils/money.util';
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
@Injectable()
export class WalletService extends BaseService {
  private static readonly MAX_RETRIES = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly settingsService: AffiliateSettingsService,
  ) {
    super('WalletService');
  }

  // ── Core primitives ───────────────────────────────────────────────────────

  /**
   * Reads a wallet, computes new balances via `compute`, and applies them with an
   * optimistic version check. Returns the before/after snapshots so the caller can
   * build the matching ledger entry inside the SAME transaction.
   *
   * Throws ConflictException when the version check fails — the caller either
   * retries (standalone path via `withOptimisticRetry`) or lets its enclosing
   * transaction roll back.
   */
  private async applyWalletMutation(
    tx: PrismaTx,
    walletId: string,
    compute: (wallet: Wallet) => WalletBalances,
  ): Promise<{ before: Wallet; after: WalletBalances & { version: number } }> {
    const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new NotFoundException(`Wallet ${walletId} not found`);

    // `compute` performs business-rule validation and throws for genuine rule
    // violations (e.g. insufficient balance). Those must NOT be retried.
    const next = compute(wallet);
    const rounded: WalletBalances = {
      availableBalance: roundCurrency(next.availableBalance),
      pendingBalance: roundCurrency(next.pendingBalance),
      lifetimeEarned: roundCurrency(next.lifetimeEarned),
      lifetimeWithdrawn: roundCurrency(next.lifetimeWithdrawn),
    };

    const result = await tx.wallet.updateMany({
      where: { id: walletId, version: wallet.version },
      data: { ...rounded, version: { increment: 1 } },
    });

    if (result.count !== 1) {
      throw new ConflictException('Wallet was modified concurrently');
    }

    return { before: wallet, after: { ...rounded, version: wallet.version + 1 } };
  }

  /** Runs a transactional unit of work, retrying only on optimistic-lock conflicts. */
  private async withOptimisticRetry<T>(work: (tx: PrismaTx) => Promise<T>): Promise<T> {
    let lastConflict: unknown;
    for (let attempt = 1; attempt <= WalletService.MAX_RETRIES; attempt += 1) {
      try {
        return await this.prisma.$transaction((tx) => work(tx));
      } catch (error) {
        const isConflict =
          error instanceof ConflictException ||
          (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034'); // write conflict / deadlock
        if (!isConflict) throw error;
        lastConflict = error;
        this.logger.warn(`Wallet mutation conflict (attempt ${attempt}/${WalletService.MAX_RETRIES}) — retrying`);
      }
    }
    this.logger.error('Wallet mutation exhausted retries', lastConflict as any);
    throw new ConflictException('Could not update wallet after retries, please retry the request');
  }

  async getWalletByAffiliateId(affiliateId: string): Promise<Wallet> {
    const wallet = await this.prisma.wallet.findUnique({ where: { affiliateId } });
    if (wallet) return wallet;
    // Defensive: every Affiliate should have been created with a Wallet.
    this.logger.warn(`Wallet missing for affiliate ${affiliateId} — creating on demand`);
    return this.prisma.wallet.create({ data: { affiliateId } });
  }

  async listTransactions(walletId: string, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { walletId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.walletTransaction.count({ where: { walletId } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ── Commission credit ─────────────────────────────────────────────────────

  /**
   * Credits an ELIGIBLE (or, when the hold period is 0, PENDING) commission into the
   * affiliate's wallet. Idempotent — an already-CREDITED commission is a no-op.
   */
  async creditCommission(commissionId: string): Promise<{ credited: boolean }> {
    const result = await this.withOptimisticRetry((tx) => this.creditCommissionWithin(tx, commissionId));
    if (result.credited) {
      await this.auditService.logEvent({
        action: 'commission.credited',
        entityType: 'Commission',
        entityId: commissionId,
        newValue: { amount: result.amount, walletId: result.walletId },
      });
    }
    return { credited: result.credited };
  }

  /**
   * Single-attempt, transaction-scoped credit. Use this when you already hold a
   * Prisma transaction (e.g. inside /payments/verify with a 0-day hold period).
   */
  async creditCommissionWithin(
    tx: PrismaTx,
    commissionId: string,
  ): Promise<{ credited: boolean; amount: number; walletId?: string }> {
    const commission = await tx.commission.findUnique({ where: { id: commissionId } });
    if (!commission) throw new NotFoundException(`Commission ${commissionId} not found`);

    // Idempotency guard — a replayed webhook / re-run sweep must not double-credit.
    if (commission.status === CommissionStatusEnum.CREDITED) {
      return { credited: false, amount: commission.commissionAmount };
    }
    if (
      commission.status !== CommissionStatusEnum.ELIGIBLE &&
      commission.status !== CommissionStatusEnum.PENDING
    ) {
      throw new BadRequestException(`Commission ${commissionId} cannot be credited from status ${commission.status}`);
    }

    const wallet = await tx.wallet.findUnique({ where: { affiliateId: commission.affiliateId } });
    if (!wallet) throw new NotFoundException(`Wallet for affiliate ${commission.affiliateId} not found`);

    const amount = roundCurrency(commission.commissionAmount);

    const { before, after } = await this.applyWalletMutation(tx, wallet.id, (w) => ({
      availableBalance: w.availableBalance + amount,
      pendingBalance: w.pendingBalance,
      lifetimeEarned: w.lifetimeEarned + amount,
      lifetimeWithdrawn: w.lifetimeWithdrawn,
    }));

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WalletTransactionTypeEnum.COMMISSION_CREDIT,
        amount,
        balanceBefore: before.availableBalance,
        balanceAfter: after.availableBalance,
        referenceType: 'commission',
        referenceId: commission.id,
        description: `Commission credited for order ${commission.orderId}`,
      },
    });

    await tx.commission.update({
      where: { id: commission.id },
      data: { status: CommissionStatusEnum.CREDITED, creditedAt: new Date() },
    });

    // Denormalised affiliate rollups (display-only; the ledger remains authoritative).
    await tx.affiliate.update({
      where: { id: commission.affiliateId },
      data: { totalEarnings: { increment: amount } },
    });

    return { credited: true, amount, walletId: wallet.id };
  }

  // ── Withdrawal lifecycle ──────────────────────────────────────────────────

  /**
   * Moves `amount` from availableBalance to pendingBalance and creates a PENDING
   * Withdrawal in the same transaction.
   */
  async reserveWithdrawal(
    affiliateId: string,
    amount: number,
    options: { payoutMethodId?: string; actorUserId?: string } = {},
  ): Promise<Withdrawal> {
    const requested = roundCurrency(amount);
    if (!(requested > 0)) throw new BadRequestException('Withdrawal amount must be greater than zero');

    const settings = await this.settingsService.get();

    const affiliate = await this.prisma.affiliate.findFirst({ where: { id: affiliateId, deletedAt: null } });
    if (!affiliate) throw new NotFoundException('Sales employee profile not found');
    if (affiliate.status !== AffiliateStatusEnum.ACTIVE) {
      throw new BadRequestException('Withdrawals are only available to active sales employees');
    }

    if (requested < settings.minimumWithdrawalAmount) {
      throw new BadRequestException(`Minimum withdrawal amount is ₹${settings.minimumWithdrawalAmount}`);
    }
    if (requested > settings.maximumWithdrawalAmount) {
      throw new BadRequestException(`Maximum withdrawal amount is ₹${settings.maximumWithdrawalAmount}`);
    }

    const payoutMethod = options.payoutMethodId
      ? await this.prisma.employeePayoutMethod.findFirst({
          where: { id: options.payoutMethodId, affiliateId },
        })
      : await this.prisma.employeePayoutMethod.findFirst({
          where: { affiliateId, isDefault: true, status: PayoutMethodStatusEnum.VERIFIED },
        });

    if (!payoutMethod) {
      throw new BadRequestException('No verified default payout method found. Add and verify one first.');
    }
    if (payoutMethod.status !== PayoutMethodStatusEnum.VERIFIED) {
      throw new BadRequestException('The selected payout method is not verified');
    }

    const wallet = await this.getWalletByAffiliateId(affiliateId);

    const withdrawal = await this.withOptimisticRetry(async (tx) => {
      const { before, after } = await this.applyWalletMutation(tx, wallet.id, (w) => {
        if (w.availableBalance < requested) {
          throw new BadRequestException('Insufficient available wallet balance');
        }
        return {
          availableBalance: w.availableBalance - requested,
          pendingBalance: w.pendingBalance + requested,
          lifetimeEarned: w.lifetimeEarned,
          lifetimeWithdrawn: w.lifetimeWithdrawn,
        };
      });

      const created = await tx.withdrawal.create({
        data: {
          affiliateId,
          walletId: wallet.id,
          amount: requested,
          status: WithdrawalStatusEnum.PENDING,
          payoutMethodId: payoutMethod.id,
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionTypeEnum.WITHDRAWAL_HOLD,
          amount: -requested,
          balanceBefore: before.availableBalance,
          balanceAfter: after.availableBalance,
          referenceType: 'withdrawal',
          referenceId: created.id,
          description: `Withdrawal request hold of ₹${requested}`,
        },
      });

      await tx.affiliate.update({
        where: { id: affiliateId },
        data: { pendingBalance: { increment: requested } },
      });

      return created;
    });

    await this.auditService.logEvent({
      action: 'withdrawal.requested',
      entityType: 'Withdrawal',
      entityId: withdrawal.id,
      newValue: { affiliateId, amount: requested, payoutMethodId: payoutMethod.id },
      userId: options.actorUserId,
    });

    return withdrawal;
  }

  /**
   * Returns held funds to availableBalance and marks the withdrawal FAILED (or
   * CANCELLED when explicitly cancelled by an admin/employee).
   * Idempotent: terminal states (PAID/CANCELLED/REVERSED) are skipped.
   */
  async releaseWithdrawalHold(
    withdrawalId: string,
    reason: string,
    options: { finalStatus?: WithdrawalStatusEnum; actorUserId?: string } = {},
  ): Promise<{ released: boolean }> {
    const finalStatus = options.finalStatus ?? WithdrawalStatusEnum.FAILED;

    const outcome = await this.withOptimisticRetry(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
      if (!withdrawal) throw new NotFoundException(`Withdrawal ${withdrawalId} not found`);

      const releasable: WithdrawalStatusEnum[] = [
        WithdrawalStatusEnum.PENDING,
        WithdrawalStatusEnum.SCHEDULED,
        WithdrawalStatusEnum.PROCESSING,
        WithdrawalStatusEnum.FAILED,
      ];
      if (!releasable.includes(withdrawal.status)) {
        // PAID / CANCELLED / REVERSED are terminal — nothing held to release.
        return { released: false, previousStatus: withdrawal.status };
      }

      // A withdrawal already FAILED has had its hold released; only allow the
      // FAILED -> CANCELLED bookkeeping transition without touching balances.
      if (withdrawal.status === WithdrawalStatusEnum.FAILED) {
        await tx.withdrawal.update({
          where: { id: withdrawalId },
          data: { status: finalStatus, failureReason: reason },
        });
        return { released: false, previousStatus: withdrawal.status };
      }

      const amount = roundCurrency(withdrawal.amount);
      const { before, after } = await this.applyWalletMutation(tx, withdrawal.walletId, (w) => ({
        availableBalance: w.availableBalance + amount,
        pendingBalance: w.pendingBalance - amount,
        lifetimeEarned: w.lifetimeEarned,
        lifetimeWithdrawn: w.lifetimeWithdrawn,
      }));

      await tx.walletTransaction.create({
        data: {
          walletId: withdrawal.walletId,
          type: WalletTransactionTypeEnum.WITHDRAWAL_RELEASE,
          amount,
          balanceBefore: before.availableBalance,
          balanceAfter: after.availableBalance,
          referenceType: 'withdrawal',
          referenceId: withdrawal.id,
          description: `Withdrawal hold released: ${reason}`,
        },
      });

      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: finalStatus, failureReason: reason },
      });

      await tx.affiliate.update({
        where: { id: withdrawal.affiliateId },
        data: { pendingBalance: { decrement: amount } },
      });

      return { released: true, previousStatus: withdrawal.status };
    });

    await this.auditService.logEvent({
      action: finalStatus === WithdrawalStatusEnum.CANCELLED ? 'withdrawal.cancelled' : 'withdrawal.failed',
      entityType: 'Withdrawal',
      entityId: withdrawalId,
      oldValue: { status: outcome.previousStatus },
      newValue: { status: finalStatus, reason, fundsReleased: outcome.released },
      userId: options.actorUserId,
    });

    return { released: outcome.released };
  }

  /**
   * Finalises a successful payout. Only a PROCESSING withdrawal may be debited —
   * this is the idempotency guard against a payout webhook firing twice.
   */
  async debitWithdrawalOnPaid(
    withdrawalId: string,
    options: { razorpayPayoutId?: string; actorUserId?: string } = {},
  ): Promise<{ debited: boolean }> {
    const outcome = await this.withOptimisticRetry(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
      if (!withdrawal) throw new NotFoundException(`Withdrawal ${withdrawalId} not found`);

      if (withdrawal.status !== WithdrawalStatusEnum.PROCESSING) {
        return { debited: false, previousStatus: withdrawal.status };
      }

      const amount = roundCurrency(withdrawal.amount);
      // availableBalance was already decremented at reservation time — only the
      // pending hold is consumed here.
      const { before, after } = await this.applyWalletMutation(tx, withdrawal.walletId, (w) => ({
        availableBalance: w.availableBalance,
        pendingBalance: w.pendingBalance - amount,
        lifetimeEarned: w.lifetimeEarned,
        lifetimeWithdrawn: w.lifetimeWithdrawn + amount,
      }));

      await tx.walletTransaction.create({
        data: {
          walletId: withdrawal.walletId,
          type: WalletTransactionTypeEnum.WITHDRAWAL_DEBIT,
          amount: -amount,
          balanceBefore: before.availableBalance,
          balanceAfter: after.availableBalance,
          referenceType: 'withdrawal',
          referenceId: withdrawal.id,
          description: `Payout completed for ₹${amount}`,
          metadata: options.razorpayPayoutId ? { razorpayPayoutId: options.razorpayPayoutId } : undefined,
        },
      });

      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: WithdrawalStatusEnum.PAID, processedAt: new Date() },
      });

      await tx.affiliate.update({
        where: { id: withdrawal.affiliateId },
        data: { pendingBalance: { decrement: amount }, paidBalance: { increment: amount } },
      });

      return { debited: true, previousStatus: withdrawal.status };
    });

    if (outcome.debited) {
      await this.auditService.logEvent({
        action: 'withdrawal.paid',
        entityType: 'Withdrawal',
        entityId: withdrawalId,
        oldValue: { status: outcome.previousStatus },
        newValue: { status: WithdrawalStatusEnum.PAID, razorpayPayoutId: options.razorpayPayoutId },
        userId: options.actorUserId,
      });
    }

    return { debited: outcome.debited };
  }

  // ── Commission reversal (refunds) ─────────────────────────────────────────

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
  async applyCommissionReversal(
    commissionId: string,
    reversalAmount: number,
    options: { reason?: string; actorUserId?: string } = {},
  ): Promise<{ reversed: boolean; causedNegativeBalance: boolean }> {
    const amount = roundCurrency(reversalAmount);

    const outcome = await this.withOptimisticRetry(async (tx) => {
      const commission = await tx.commission.findUnique({ where: { id: commissionId } });
      if (!commission) throw new NotFoundException(`Commission ${commissionId} not found`);

      // Idempotency: never double-reverse.
      if (commission.status === CommissionStatusEnum.REVERSED) {
        return { reversed: false, causedNegativeBalance: false, previousStatus: commission.status };
      }

      if (commission.status !== CommissionStatusEnum.CREDITED) {
        // Nothing was ever added to the wallet — pure status transition.
        await tx.commission.update({
          where: { id: commissionId },
          data: {
            status: CommissionStatusEnum.REVERSED,
            reversedAt: new Date(),
            reversedAmount: amount,
          },
        });
        return { reversed: true, causedNegativeBalance: false, previousStatus: commission.status };
      }

      const wallet = await tx.wallet.findUnique({ where: { affiliateId: commission.affiliateId } });
      if (!wallet) throw new NotFoundException(`Wallet for affiliate ${commission.affiliateId} not found`);

      const { before, after } = await this.applyWalletMutation(tx, wallet.id, (w) => ({
        // Deliberately NOT clamped at zero — see method docblock.
        availableBalance: w.availableBalance - amount,
        pendingBalance: w.pendingBalance,
        lifetimeEarned: w.lifetimeEarned,
        lifetimeWithdrawn: w.lifetimeWithdrawn,
      }));

      const causesNegativeBalance = after.availableBalance < 0;

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionTypeEnum.COMMISSION_REVERSAL,
          amount: -amount,
          balanceBefore: before.availableBalance,
          balanceAfter: after.availableBalance,
          referenceType: 'commission',
          referenceId: commission.id,
          description: options.reason ?? `Commission reversed due to refund on order ${commission.orderId}`,
          metadata: {
            causesNegativeBalance,
            deficitAmount: causesNegativeBalance ? after.availableBalance : 0,
          },
        },
      });

      await tx.commission.update({
        where: { id: commissionId },
        data: {
          status: CommissionStatusEnum.REVERSED,
          reversedAt: new Date(),
          reversedAmount: amount,
        },
      });

      await tx.affiliate.update({
        where: { id: commission.affiliateId },
        data: { totalEarnings: { decrement: amount } },
      });

      return { reversed: true, causedNegativeBalance: causesNegativeBalance, previousStatus: commission.status };
    });

    if (outcome.reversed) {
      await this.auditService.logEvent({
        action: 'commission.reversed',
        entityType: 'Commission',
        entityId: commissionId,
        oldValue: { status: outcome.previousStatus },
        newValue: {
          status: CommissionStatusEnum.REVERSED,
          reversedAmount: amount,
          causedNegativeBalance: outcome.causedNegativeBalance,
          reason: options.reason,
        },
        userId: options.actorUserId,
      });
    }

    return { reversed: outcome.reversed, causedNegativeBalance: outcome.causedNegativeBalance };
  }

  /**
   * Payout reversal from RazorpayX (`payout.reversed`): money never left the bank,
   * so the funds go back to availableBalance and the withdrawal is marked REVERSED.
   */
  async reverseWithdrawalPayout(withdrawalId: string, reason: string): Promise<{ reversed: boolean }> {
    const outcome = await this.withOptimisticRetry(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
      if (!withdrawal) throw new NotFoundException(`Withdrawal ${withdrawalId} not found`);

      if (withdrawal.status === WithdrawalStatusEnum.REVERSED) {
        return { reversed: false, previousStatus: withdrawal.status };
      }

      const amount = roundCurrency(withdrawal.amount);
      const wasPaid = withdrawal.status === WithdrawalStatusEnum.PAID;
      const wasHeld =
        withdrawal.status === WithdrawalStatusEnum.PROCESSING ||
        withdrawal.status === WithdrawalStatusEnum.SCHEDULED ||
        withdrawal.status === WithdrawalStatusEnum.PENDING;

      if (!wasPaid && !wasHeld) {
        return { reversed: false, previousStatus: withdrawal.status };
      }

      const { before, after } = await this.applyWalletMutation(tx, withdrawal.walletId, (w) => ({
        availableBalance: w.availableBalance + amount,
        // A PAID withdrawal already consumed its pending hold; a still-held one has not.
        pendingBalance: wasPaid ? w.pendingBalance : w.pendingBalance - amount,
        lifetimeEarned: w.lifetimeEarned,
        lifetimeWithdrawn: wasPaid ? w.lifetimeWithdrawn - amount : w.lifetimeWithdrawn,
      }));

      await tx.walletTransaction.create({
        data: {
          walletId: withdrawal.walletId,
          type: WalletTransactionTypeEnum.PAYOUT_REVERSAL,
          amount,
          balanceBefore: before.availableBalance,
          balanceAfter: after.availableBalance,
          referenceType: 'withdrawal',
          referenceId: withdrawal.id,
          description: `Payout reversed: ${reason}`,
        },
      });

      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: WithdrawalStatusEnum.REVERSED, failureReason: reason },
      });

      await tx.affiliate.update({
        where: { id: withdrawal.affiliateId },
        data: wasPaid
          ? { paidBalance: { decrement: amount } }
          : { pendingBalance: { decrement: amount } },
      });

      return { reversed: true, previousStatus: withdrawal.status };
    });

    if (outcome.reversed) {
      await this.auditService.logEvent({
        action: 'withdrawal.reversed',
        entityType: 'Withdrawal',
        entityId: withdrawalId,
        oldValue: { status: outcome.previousStatus },
        newValue: { status: WithdrawalStatusEnum.REVERSED, reason },
      });
    }

    return { reversed: outcome.reversed };
  }
}

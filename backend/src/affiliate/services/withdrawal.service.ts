import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Withdrawal, WithdrawalStatusEnum } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { AdminWithdrawalListQueryDto } from '../dto/admin-list-query.dto';
import { RequestWithdrawalDto } from '../dto/request-withdrawal.dto';
import { RazorpayXGateway } from './razorpayx.provider';
import { WalletService } from './wallet.service';

@Injectable()
export class WithdrawalService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly razorpayx: RazorpayXGateway,
    private readonly auditService: AuditService,
    private readonly notifications: NotificationsService,
  ) {
    super('WithdrawalService');
  }

  // ── Employee-facing ───────────────────────────────────────────────────────

  async requestWithdrawal(affiliateId: string, dto: RequestWithdrawalDto, actorUserId?: string): Promise<Withdrawal> {
    return this.walletService.reserveWithdrawal(affiliateId, dto.amount, {
      payoutMethodId: dto.payoutMethodId,
      actorUserId,
    });
  }

  private static readonly ADMIN_WITHDRAWAL_INCLUDE = {
    payoutMethod: { select: { id: true, type: true, maskedDetails: true, last4: true } },
    affiliate: {
      select: {
        id: true,
        affiliateCode: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    },
  } as const;

  /** Flattens the nested Prisma row into the shape the admin withdrawals table renders. */
  private toAdminRow(w: Prisma.WithdrawalGetPayload<{ include: typeof WithdrawalService.ADMIN_WITHDRAWAL_INCLUDE }>) {
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

  async list(params: {
    affiliateId?: string;
    status?: WithdrawalStatusEnum;
    page?: number;
    limit?: number;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const where: Prisma.WithdrawalWhereInput = {};
    if (params.affiliateId) where.affiliateId = params.affiliateId;
    if (params.status) where.status = params.status;

    const [rows, total] = await Promise.all([
      this.prisma.withdrawal.findMany({
        where,
        include: WithdrawalService.ADMIN_WITHDRAWAL_INCLUDE,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { requestedAt: 'desc' },
      }),
      this.prisma.withdrawal.count({ where }),
    ]);

    return { data: rows.map((r) => this.toAdminRow(r)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, scopeAffiliateId?: string) {
    const withdrawal = await this.prisma.withdrawal.findFirst({
      where: { id, ...(scopeAffiliateId ? { affiliateId: scopeAffiliateId } : {}) },
      include: WithdrawalService.ADMIN_WITHDRAWAL_INCLUDE,
    });
    if (!withdrawal) throw new NotFoundException(`Withdrawal ${id} not found`);
    return this.toAdminRow(withdrawal);
  }

  // ── Admin actions ─────────────────────────────────────────────────────────

  /** PENDING -> SCHEDULED. Funds stay held; the sweep or an admin then processes it. */
  async approve(id: string, actorUserId?: string): Promise<Withdrawal> {
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id } });
    if (!withdrawal) throw new NotFoundException(`Withdrawal ${id} not found`);
    if (withdrawal.status !== WithdrawalStatusEnum.PENDING) {
      throw new BadRequestException(`Only PENDING withdrawals can be approved (current: ${withdrawal.status})`);
    }

    const updated = await this.prisma.withdrawal.update({
      where: { id },
      data: { status: WithdrawalStatusEnum.SCHEDULED, scheduledAt: new Date() },
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
  async process(id: string, actorUserId?: string): Promise<Withdrawal> {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id },
      include: { payoutMethod: true, affiliate: { select: { userId: true } } },
    });
    if (!withdrawal) throw new NotFoundException(`Withdrawal ${id} not found`);

    const processable: WithdrawalStatusEnum[] = [WithdrawalStatusEnum.PENDING, WithdrawalStatusEnum.SCHEDULED];
    if (!processable.includes(withdrawal.status)) {
      throw new BadRequestException(`Withdrawal cannot be processed from status ${withdrawal.status}`);
    }
    if (!withdrawal.payoutMethod?.razorpayFundAccountId) {
      throw new BadRequestException('Withdrawal has no linked RazorpayX fund account');
    }

    // Conditional transition — guards against two admins clicking "process" at once.
    const claimed = await this.prisma.withdrawal.updateMany({
      where: { id, status: withdrawal.status },
      data: { status: WithdrawalStatusEnum.PROCESSING },
    });
    if (claimed.count !== 1) {
      throw new BadRequestException('Withdrawal is already being processed');
    }

    try {
      const payout = await this.razorpayx.createPayout(
        withdrawal.id,
        withdrawal.amount,
        withdrawal.payoutMethod.razorpayFundAccountId,
        `withdrawal_${withdrawal.id}`,
      );

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
        newValue: { status: WithdrawalStatusEnum.PROCESSING, razorpayPayoutId: payout.payoutId },
        userId: actorUserId,
      });

      return updated;
    } catch (error) {
      const reason = (error as Error).message ?? 'Payout initiation failed';
      this.logger.error(`Payout initiation failed for withdrawal ${id}: ${reason}`);

      // Return the held funds — the gateway never accepted the payout.
      await this.walletService.releaseWithdrawalHold(id, reason, { actorUserId });
      await this.notifyFailure(withdrawal.affiliate.userId, withdrawal.amount, reason);

      throw new BadRequestException(`Payout initiation failed: ${reason}`);
    }
  }

  /** Retries a FAILED withdrawal by re-reserving funds and re-initiating the payout. */
  async retry(id: string, actorUserId?: string): Promise<Withdrawal> {
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id } });
    if (!withdrawal) throw new NotFoundException(`Withdrawal ${id} not found`);
    if (withdrawal.status !== WithdrawalStatusEnum.FAILED) {
      throw new BadRequestException(`Only FAILED withdrawals can be retried (current: ${withdrawal.status})`);
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
  async cancel(id: string, reason: string, actorUserId?: string): Promise<Withdrawal> {
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id } });
    if (!withdrawal) throw new NotFoundException(`Withdrawal ${id} not found`);

    const cancellable: WithdrawalStatusEnum[] = [
      WithdrawalStatusEnum.PENDING,
      WithdrawalStatusEnum.SCHEDULED,
      WithdrawalStatusEnum.FAILED,
    ];
    if (!cancellable.includes(withdrawal.status)) {
      throw new BadRequestException(`Withdrawal cannot be cancelled from status ${withdrawal.status}`);
    }

    await this.walletService.releaseWithdrawalHold(id, reason || 'Cancelled by admin', {
      finalStatus: WithdrawalStatusEnum.CANCELLED,
      actorUserId,
    });

    return this.prisma.withdrawal.findUniqueOrThrow({ where: { id } });
  }

  // ── Webhook-driven transitions ────────────────────────────────────────────

  async findByRazorpayPayoutId(payoutId: string) {
    return this.prisma.withdrawal.findFirst({
      where: { razorpayPayoutId: payoutId },
      include: { affiliate: { select: { userId: true } } },
    });
  }

  async markPaidFromWebhook(withdrawalId: string, payoutId: string, notifyUserId: string, amount: number) {
    const result = await this.walletService.debitWithdrawalOnPaid(withdrawalId, { razorpayPayoutId: payoutId });
    if (result.debited) {
      await this.notifications.notifyWithdrawalProcessed(notifyUserId, amount).catch(() => undefined);
    }
    return result;
  }

  async markFailedFromWebhook(withdrawalId: string, reason: string, notifyUserId: string, amount: number) {
    const result = await this.walletService.releaseWithdrawalHold(withdrawalId, reason);
    await this.notifyFailure(notifyUserId, amount, reason);
    return result;
  }

  private async notifyFailure(userId: string, amount: number, reason: string) {
    await this.notifications.notifyWithdrawalFailed(userId, amount, reason).catch(() => undefined);
  }
}

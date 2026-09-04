import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { RazorpayGateway } from './razorpay.provider';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { Commission, OrderStatusEnum, PaymentStatusEnum } from '@prisma/client';
import { AffiliateService } from '../affiliate/services/affiliate.service';
import { AffiliateSettingsService } from '../affiliate/services/affiliate-settings.service';
import { CommissionService } from '../affiliate/services/commission.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class PaymentsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayGateway: RazorpayGateway,
    private readonly affiliateService: AffiliateService,
    private readonly affiliateSettingsService: AffiliateSettingsService,
    private readonly commissionService: CommissionService,
    private readonly notificationsService: NotificationsService,
    private readonly invoicesService: InvoicesService,
  ) {
    super('PaymentsService');
  }

  private generatePaymentNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PAY-${timestamp}-${random}`;
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  }

  /**
   * Creates a Razorpay gateway order and a pending Payment record.
   * Never trusts client-side amount — fetches from DB.
   */
  async createPaymentOrder(dto: CreatePaymentOrderDto, requesterId?: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, deletedAt: null },
      include: {
        client: { include: { user: { select: { id: true, email: true, firstName: true } } } },
      },
    });
    if (!order) throw new NotFoundException(`Order ${dto.orderId} not found`);

    const nonPayableStatuses: OrderStatusEnum[] = [OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELLED];
    if (nonPayableStatuses.includes(order.status)) {
      throw new BadRequestException(`Order ${order.orderNumber} cannot be paid in its current status`);
    }

    // ── Sales-employee attribution (optional) ───────────────────────────────
    // Runs BEFORE any gateway call. An invalid/inactive code aborts here, so no
    // Razorpay order, no Payment row and no Commission row can ever exist for one.
    // Behaviour is completely unchanged when employeeCode is omitted.
    let frozenCommission: Commission | null = null;
    if (dto.employeeCode) {
      // Self-referral is evaluated against the CLIENT the order belongs to, not the
      // JWT caller — checkout may legitimately be initiated on the client's behalf.
      const buyerUserId = order.client?.userId;
      const validation = await this.affiliateService.validateEmployeeCode(dto.employeeCode, buyerUserId);

      if (!validation.valid || !validation.affiliate) {
        throw new BadRequestException('Invalid or inactive employee code');
      }

      const settings = await this.affiliateSettingsService.get();
      // Every monetary input is derived from DB rows — never from the request body.
      frozenCommission = await this.commissionService.resolveAndFreezeCommission(
        order,
        validation.affiliate,
        settings,
      );
    }

    const receipt = order.orderNumber;
    const currency = dto.currency ?? order.currency ?? 'INR';
    // netAmount is the pre-tax taxable base (see CommissionService's documented mapping);
    // the amount actually payable — and the amount to charge on the gateway — includes tax.
    const grandTotal = Number(order.netAmount) + Number(order.taxAmount);

    // The gateway call is deliberately OUTSIDE any DB transaction — an external HTTP
    // call cannot be rolled back, so it is sequenced between the two DB writes.
    const gatewayOrder = await this.razorpayGateway.createOrder(grandTotal, currency, receipt);

    const paymentNumber = this.generatePaymentNumber();

    const payment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          paymentNumber,
          amount: grandTotal,
          currency,
          status: PaymentStatusEnum.PENDING,
          gatewayProvider: 'RAZORPAY',
          gatewayOrderId: gatewayOrder.gatewayOrderId,
          orderId: order.id,
          createdBy: requesterId ?? null,
        },
      });

      if (frozenCommission) {
        await this.commissionService.attachPaymentOp(tx, frozenCommission.id, created.id);
      }

      return created;
    });

    return {
      payment,
      gatewayOrder,
      keyId: this.razorpayGateway['keyId'],
    };
  }

  /**
   * Verifies Razorpay payment signature on the backend.
   * NEVER trusts client-side payment status.
   */
  async verifyPayment(dto: VerifyPaymentDto, verifiedBy?: string) {
    const payment = await this.loadPaymentWithOrder(dto.razorpayOrderId);

    if (!payment) {
      throw new NotFoundException(`No payment found for Razorpay order: ${dto.razorpayOrderId}`);
    }

    if (payment.status === PaymentStatusEnum.SUCCESSFUL) {
      // Idempotent: the webhook may have already recorded this payment before the
      // client's own verify call arrives. From the payer's perspective this IS a
      // success, so return the payment rather than a 400 — an error here would
      // make a successful payment look like a failure to the customer.
      return payment;
    }

    const { isValid, transactionId } = this.razorpayGateway.verifyPaymentSignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );

    if (!isValid) {
      // Record failed attempt
      await this.prisma.transaction.create({
        data: {
          transactionId: this.generateTransactionId(),
          type: 'PAYMENT_ATTEMPT',
          amount: payment.amount,
          currency: payment.currency,
          status: 'SIGNATURE_FAILED',
          paymentId: payment.id,
          metadata: JSON.stringify({ razorpayPaymentId: dto.razorpayPaymentId }),
        },
      });
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatusEnum.FAILED },
      });
      throw new ForbiddenException('Payment signature verification failed');
    }

    return this.finalizeSuccessfulPayment(payment, transactionId, verifiedBy);
  }

  /**
   * Records a captured payment exactly once, no matter which of the two
   * independent paths gets there first: the client's own POST /payments/verify,
   * or Razorpay's payment.captured webhook. Both call this same method instead
   * of each running their own partial version, so subscription creation,
   * commission settlement, notifications, and invoicing can never be skipped
   * (if one path wins the race) or run twice (if both fire).
   *
   * Idempotency is enforced by the conditional update below — `updateMany` with
   * `status: { not: SUCCESSFUL }` only affects a row for whichever caller gets
   * there first, even under a genuine concurrent race, since Postgres resolves
   * the two UPDATEs serially. The loser sees `count === 0` and just returns the
   * already-settled payment instead of re-running any side effects.
   */
  async finalizeSuccessfulPayment(
    payment: NonNullable<Awaited<ReturnType<PaymentsService['loadPaymentWithOrder']>>>,
    gatewayTransactionId: string,
    verifiedBy?: string,
  ) {
    const affiliateSettings = await this.affiliateSettingsService.get();

    const result = await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.payment.updateMany({
        where: { id: payment.id, status: { not: PaymentStatusEnum.SUCCESSFUL } },
        data: {
          status: PaymentStatusEnum.SUCCESSFUL,
          gatewayTransactionId,
          paidAt: new Date(),
          updatedBy: verifiedBy ?? null,
        },
      });

      if (count === 0) {
        // Another caller (webhook or client verify) already finalized this
        // payment concurrently — nothing left to do here.
        return { alreadyFinalized: true as const };
      }

      await tx.transaction.create({
        data: {
          transactionId: gatewayTransactionId,
          type: 'PAYMENT_CAPTURED',
          amount: payment.amount,
          currency: payment.currency,
          status: 'SUCCESS',
          paymentId: payment.id,
          metadata: JSON.stringify({
            gatewayTransactionId,
            gatewayOrderId: payment.gatewayOrderId,
          }),
        },
      });

      await tx.order.update({
        where: { id: payment.orderId! },
        data: { status: OrderStatusEnum.CONFIRMED },
      });

      await tx.timeline.create({
        data: {
          title: `Payment received`,
          description: `Payment of ₹${payment.amount} ${payment.currency} received successfully`,
          eventType: 'PAYMENT_RECEIVED',
          orderId: payment.orderId ?? undefined,
          clientId: (payment.order as any)?.clientId ?? undefined,
          userId: verifiedBy ?? undefined,
        },
      });

      if (payment.order?.packageId) {
        const currentPeriodStart = new Date();
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // Default to monthly

        await tx.subscription.create({
          data: {
            subscriptionNumber: `SUB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            clientId: payment.order.clientId,
            packageId: payment.order.packageId,
            price: Number(payment.amount),
            currency: payment.currency,
            status: 'ACTIVE',
            interval: 'MONTHLY',
            currentPeriodStart,
            currentPeriodEnd,
          },
        });
      }

      let settled: Awaited<ReturnType<CommissionService['settleCommissionOnPaymentSuccess']>> = null;
      if (payment.orderId) {
        settled = await this.commissionService.settleCommissionOnPaymentSuccess(
          tx,
          payment.orderId,
          affiliateSettings,
        );
      }

      const updated = await tx.payment.findUniqueOrThrow({ where: { id: payment.id } });
      return { alreadyFinalized: false as const, updatedPayment: updated, settledCommission: settled };
    });

    if (result.alreadyFinalized) {
      return this.prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
    }

    const { updatedPayment, settledCommission } = result;

    // Notifications are fired after commit — never inside the transaction.
    if (settledCommission?.commission) {
      try {
        const affiliate = await this.prisma.affiliate.findUnique({
          where: { id: settledCommission.commission.affiliateId },
          select: { userId: true },
        });
        if (affiliate) {
          await this.notificationsService.notifyCommissionEarned(
            affiliate.userId,
            settledCommission.commission.commissionAmount,
            payment.order?.orderNumber ?? '',
            settledCommission.commission.currency,
          );
          if (settledCommission.credited) {
            await this.notificationsService.notifyCommissionCredited(
              affiliate.userId,
              settledCommission.commission.commissionAmount,
              settledCommission.commission.currency,
            );
          }
        }
      } catch (error) {
        // A notification failure must never fail a settled payment.
        this.logger.error(`Failed to notify affiliate of commission: ${(error as Error).message}`);
      }
    }

    // Invoice record creation — after commit, best-effort, never fails the payment.
    // The PDF itself is generated on demand (GET /invoices/:id/pdf), not here.
    if (payment.orderId) {
      try {
        await this.invoicesService.createFromOrder(payment.orderId);
        this.logger.log(`✅ Invoice record created for Order ${payment.orderId}`);
      } catch (error) {
        this.logger.error(`❌ Failed to create invoice for Order ${payment.orderId}: ${(error as Error).message}`);
      }
    }

    this.logger.log(`✅ Payment verified: ${payment.paymentNumber} (₹${payment.amount})`);
    return updatedPayment;
  }

  /** Shared payment-with-relations loader so the webhook and verifyPayment fetch identically shaped records. */
  async loadPaymentWithOrder(gatewayOrderId: string) {
    return this.prisma.payment.findFirst({
      where: { gatewayOrderId },
      include: { order: { include: { client: true } } },
    });
  }

  async findAll(clientId?: string, status?: PaymentStatusEnum, page = 1, limit = 20) {
    const where: any = {};
    if (clientId) {
      // Scope to client's orders
      where.order = { clientId };
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          order: {
            select: {
              orderNumber: true,
              status: true,
              client: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
            },
          },
          transactions: { orderBy: { createdAt: 'desc' } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: true,
        invoice: true,
        transactions: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!payment) throw new NotFoundException(`Payment ${id} not found`);
    return payment;
  }

  async findMyPayments(userId: string, page = 1, limit = 20) {
    const clientProfile = await this.prisma.clientProfile.findFirst({
      where: { userId, deletedAt: null },
    });
    if (!clientProfile) throw new NotFoundException('Client profile not found');

    return this.findAll(clientProfile.id, undefined, page, limit);
  }
}

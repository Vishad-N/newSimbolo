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

@Injectable()
export class PaymentsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayGateway: RazorpayGateway,
    private readonly affiliateService: AffiliateService,
    private readonly affiliateSettingsService: AffiliateSettingsService,
    private readonly commissionService: CommissionService,
    private readonly notificationsService: NotificationsService,
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

    // The gateway call is deliberately OUTSIDE any DB transaction — an external HTTP
    // call cannot be rolled back, so it is sequenced between the two DB writes.
    const gatewayOrder = await this.razorpayGateway.createOrder(order.netAmount, currency, receipt);

    const paymentNumber = this.generatePaymentNumber();

    const payment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          paymentNumber,
          amount: order.netAmount,
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
    const payment = await this.prisma.payment.findFirst({
      where: { gatewayOrderId: dto.razorpayOrderId },
      include: { order: { include: { client: true } } },
    });

    if (!payment) {
      throw new NotFoundException(`No payment found for Razorpay order: ${dto.razorpayOrderId}`);
    }

    if (payment.status === PaymentStatusEnum.SUCCESSFUL) {
      throw new BadRequestException('Payment already verified and recorded');
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

    // Program settings are read outside the transaction to keep it short.
    const affiliateSettings = await this.affiliateSettingsService.get();

    // Successful payment — update records.
    // Converted from a batched array transaction to an interactive one so the
    // affiliate commission can settle inside the SAME transaction as the payment
    // and order state changes. The set of writes below is otherwise unchanged.
    const { updatedPayment, settledCommission } = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatusEnum.SUCCESSFUL,
          gatewayTransactionId: transactionId,
          paidAt: new Date(),
          updatedBy: verifiedBy ?? null,
        },
      });

      await tx.transaction.create({
        data: {
          transactionId: this.generateTransactionId(),
          type: 'PAYMENT_CAPTURED',
          amount: payment.amount,
          currency: payment.currency,
          status: 'SUCCESS',
          paymentId: payment.id,
          metadata: JSON.stringify({
            razorpayPaymentId: dto.razorpayPaymentId,
            razorpayOrderId: dto.razorpayOrderId,
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
            price: payment.amount,
            currency: payment.currency,
            status: 'ACTIVE',
            interval: 'MONTHLY',
            currentPeriodStart,
            currentPeriodEnd,
          },
        });
      }

      // Affiliate commission settlement.
      // Idempotency note: re-verifying an already-SUCCESSFUL payment is rejected by
      // the early-exit check above ("Payment already verified and recorded"), so this
      // block cannot run twice for the same payment. settleCommissionOnPaymentSuccess
      // only matches PENDING commissions, giving a second layer of protection.
      let settled: Awaited<ReturnType<CommissionService['settleCommissionOnPaymentSuccess']>> = null;
      if (payment.orderId) {
        settled = await this.commissionService.settleCommissionOnPaymentSuccess(
          tx,
          payment.orderId,
          affiliateSettings,
        );
      }

      return { updatedPayment: updated, settledCommission: settled };
    });

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

    this.logger.log(`✅ Payment verified: ${payment.paymentNumber} (₹${payment.amount})`);
    return updatedPayment;
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

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayGateway } from '../payments/razorpay.provider';
import { InvoicesService } from '../invoices/invoices.service';
import { CommissionService } from '../affiliate/services/commission.service';
import { OrderStatusEnum, PaymentStatusEnum } from '@prisma/client';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger('WebhooksService');
  private readonly webhookSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayGateway: RazorpayGateway,
    private readonly configService: ConfigService,
    private readonly invoicesService: InvoicesService,
    private readonly commissionService: CommissionService,
  ) {
    this.webhookSecret = this.configService.get<string>('razorpay.webhookSecret', 'mock-razorpay-webhook-secret');
  }

  async handleRazorpayWebhook(rawBody: Buffer, signature: string): Promise<{ processed: boolean; event: string }> {
    // Step 1: Validate signature
    const isValid = this.razorpayGateway.verifyWebhookSignature(rawBody, signature, this.webhookSecret);
    if (!isValid) {
      this.logger.warn('🚨 Invalid Razorpay webhook signature received');
      throw new BadRequestException('Invalid webhook signature');
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      throw new BadRequestException('Invalid webhook JSON payload');
    }

    const eventName = payload?.event as string;
    this.logger.log(`📬 Razorpay webhook received: ${eventName}`);

    // Log to AuditLog
    await this.prisma.auditLog.create({
      data: {
        action: `WEBHOOK_RECEIVED`,
        entityType: 'RAZORPAY_WEBHOOK',
        entityId: payload?.payload?.payment?.entity?.id ?? 'unknown',
        newValue: JSON.stringify({ event: eventName }),
      },
    });

    // Step 2: Route by event type (idempotent processing)
    switch (eventName) {
      case 'payment.captured':
        await this.handlePaymentCaptured(payload.payload?.payment?.entity);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(payload.payload?.payment?.entity);
        break;
      case 'refund.processed':
        await this.handleRefundProcessed(payload.payload?.refund?.entity);
        break;
      case 'subscription.charged':
        await this.handleSubscriptionCharged(payload.payload?.subscription?.entity);
        break;
      case 'subscription.cancelled':
        await this.handleSubscriptionCancelled(payload.payload?.subscription?.entity);
        break;
      default:
        this.logger.log(`📬 Unhandled webhook event: ${eventName} — logged and ignored`);
    }

    return { processed: true, event: eventName };
  }

  private async handlePaymentCaptured(entity: any) {
    if (!entity?.id) return;
    const razorpayPaymentId = entity.id;
    const razorpayOrderId = entity.order_id;

    // Idempotency: check if already processed
    const existing = await this.prisma.transaction.findFirst({
      where: { transactionId: razorpayPaymentId },
    });
    if (existing) {
      this.logger.log(`🔄 Idempotent skip: payment ${razorpayPaymentId} already recorded`);
      return;
    }

    const payment = await this.prisma.payment.findFirst({
      where: { gatewayOrderId: razorpayOrderId },
    });

    if (payment) {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatusEnum.SUCCESSFUL,
            gatewayTransactionId: razorpayPaymentId,
            paidAt: new Date(),
          },
        }),
        this.prisma.transaction.create({
          data: {
            transactionId: razorpayPaymentId,
            type: 'PAYMENT_CAPTURED',
            amount: (entity.amount ?? 0) / 100,
            currency: entity.currency ?? 'INR',
            status: 'SUCCESS',
            paymentId: payment.id,
            metadata: JSON.stringify({ method: entity.method, email: entity.email }),
          },
        }),
        ...(payment.orderId
          ? [
              this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: OrderStatusEnum.CONFIRMED },
              }),
            ]
          : []),
      ]);
      this.logger.log(`✅ Webhook: Payment ${razorpayPaymentId} captured and recorded`);

      // Automatically generate invoice if attached to an order
      if (payment.orderId) {
        try {
          await this.invoicesService.createFromOrder(payment.orderId);
          this.logger.log(`✅ Webhook: Invoice generated for Order ${payment.orderId}`);
        } catch (error) {
          this.logger.error(`❌ Webhook: Failed to generate invoice for Order ${payment.orderId}: ${error.message}`);
        }
      }
    }
  }

  private async handlePaymentFailed(entity: any) {
    if (!entity?.id || !entity?.order_id) return;
    const razorpayOrderId = entity.order_id;

    const payment = await this.prisma.payment.findFirst({
      where: { gatewayOrderId: razorpayOrderId },
    });

    if (payment && payment.status !== PaymentStatusEnum.FAILED) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatusEnum.FAILED },
      });
      await this.prisma.transaction.create({
        data: {
          transactionId: entity.id,
          type: 'PAYMENT_FAILED',
          amount: (entity.amount ?? 0) / 100,
          currency: entity.currency ?? 'INR',
          status: 'FAILED',
          paymentId: payment.id,
          metadata: JSON.stringify({
            errorCode: entity.error_code,
            errorDescription: entity.error_description,
          }),
        },
      });
      this.logger.warn(`❌ Webhook: Payment failed for order ${razorpayOrderId}`);
    }
  }

  private async handleRefundProcessed(entity: any) {
    if (!entity?.payment_id) return;
    const payment = await this.prisma.payment.findFirst({
      where: { gatewayTransactionId: entity.payment_id },
      include: { order: { select: { id: true, netAmount: true, taxAmount: true } } },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatusEnum.REFUNDED },
      });
      await this.prisma.transaction.create({
        data: {
          transactionId: entity.id ?? `refund_${Date.now()}`,
          type: 'REFUND_PROCESSED',
          amount: (entity.amount ?? 0) / 100,
          currency: entity.currency ?? 'INR',
          status: 'REFUNDED',
          paymentId: payment.id,
          metadata: JSON.stringify({ reason: entity.notes?.reason ?? 'N/A' }),
        },
      });
      this.logger.log(`💸 Webhook: Refund processed for payment ${entity.payment_id}`);

      // Affiliate commission clawback. Proportional for partial refunds; a full
      // refund reverses the whole commission. Idempotency is provided both by the
      // transaction-level check above and by a REVERSED-status guard inside
      // reverseCommission, so a replayed webhook cannot double-reverse.
      if (payment.orderId && payment.order) {
        try {
          const refundAmount = (entity.amount ?? 0) / 100; // Razorpay sends paise
          // The customer-paid total is the taxable base plus tax.
          const orderTotal = payment.order.netAmount + payment.order.taxAmount;
          await this.commissionService.reverseCommission(payment.orderId, refundAmount, orderTotal);
        } catch (error) {
          this.logger.error(
            `❌ Webhook: Commission reversal failed for order ${payment.orderId}: ${(error as Error).message}`,
          );
        }
      }
    }
  }

  private async handleSubscriptionCharged(entity: any) {
    if (!entity?.id) return;
    const razorpaySubscriptionId = entity.id;
    const subscription = await this.prisma.subscription.findFirst({
      where: { razorpaySubscriptionId },
    });

    if (subscription) {
      const newEnd = new Date(subscription.currentPeriodEnd);
      if (subscription.interval === 'MONTHLY') newEnd.setMonth(newEnd.getMonth() + 1);
      else if (subscription.interval === 'QUARTERLY') newEnd.setMonth(newEnd.getMonth() + 3);
      else newEnd.setFullYear(newEnd.getFullYear() + 1);

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          currentPeriodStart: subscription.currentPeriodEnd,
          currentPeriodEnd: newEnd,
          status: 'ACTIVE',
        },
      });
      this.logger.log(`🔄 Webhook: Subscription ${razorpaySubscriptionId} renewed`);
    }
  }

  private async handleSubscriptionCancelled(entity: any) {
    if (!entity?.id) return;
    const subscription = await this.prisma.subscription.findFirst({
      where: { razorpaySubscriptionId: entity.id },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'CANCELED' },
      });
      this.logger.log(`❌ Webhook: Subscription ${entity.id} cancelled`);
    }
  }
}

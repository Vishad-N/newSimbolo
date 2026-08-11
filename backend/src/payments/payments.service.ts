import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { RazorpayGateway } from './razorpay.provider';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { OrderStatusEnum, PaymentStatusEnum } from '@prisma/client';

@Injectable()
export class PaymentsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayGateway: RazorpayGateway,
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
        client: { include: { user: { select: { email: true, firstName: true } } } },
      },
    });
    if (!order) throw new NotFoundException(`Order ${dto.orderId} not found`);

    const nonPayableStatuses: OrderStatusEnum[] = [OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELLED];
    if (nonPayableStatuses.includes(order.status)) {
      throw new BadRequestException(`Order ${order.orderNumber} cannot be paid in its current status`);
    }

    const receipt = order.orderNumber;
    const currency = dto.currency ?? order.currency ?? 'INR';

    const gatewayOrder = await this.razorpayGateway.createOrder(order.netAmount, currency, receipt);

    const paymentNumber = this.generatePaymentNumber();

    const payment = await this.prisma.payment.create({
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

    const txActions: any[] = [
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatusEnum.SUCCESSFUL,
          gatewayTransactionId: transactionId,
          paidAt: new Date(),
          updatedBy: verifiedBy ?? null,
        },
      }),
      this.prisma.transaction.create({
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
      }),
      this.prisma.order.update({
        where: { id: payment.orderId! },
        data: { status: OrderStatusEnum.CONFIRMED },
      }),
      this.prisma.timeline.create({
        data: {
          title: `Payment received`,
          description: `Payment of ₹${payment.amount} ${payment.currency} received successfully`,
          eventType: 'PAYMENT_RECEIVED',
          orderId: payment.orderId ?? undefined,
          clientId: (payment.order as any)?.clientId ?? undefined,
          userId: verifiedBy ?? undefined,
        },
      }),
    ];

    if (payment.order?.packageId) {
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // Default to monthly

      txActions.push(
        this.prisma.subscription.create({
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
          }
        })
      );
    }

    // Successful payment — update records
    const [updatedPayment] = await this.prisma.$transaction(txActions);

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

import { ForbiddenException } from '@nestjs/common';
import { OrderStatusEnum, PaymentStatusEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayGateway } from './razorpay.provider';
import { PaymentsService } from './payments.service';
import { AffiliateService } from '../affiliate/services/affiliate.service';
import { AffiliateSettingsService } from '../affiliate/services/affiliate-settings.service';
import { CommissionService } from '../affiliate/services/commission.service';
import { NotificationsService } from '../notifications/notifications.service';

type PaymentsPrismaMock = {
  payment: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
  transaction: {
    create: jest.Mock;
  };
  order: {
    update: jest.Mock;
  };
  timeline: {
    create: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('PaymentsService', () => {
  let prisma: PaymentsPrismaMock;
  let gateway: jest.Mocked<Pick<RazorpayGateway, 'verifyPaymentSignature'>>;
  let service: PaymentsService;
  let affiliateService: { validateEmployeeCode: jest.Mock };
  let affiliateSettingsService: { get: jest.Mock };
  let commissionService: {
    resolveAndFreezeCommission: jest.Mock;
    attachPaymentOp: jest.Mock;
    settleCommissionOnPaymentSuccess: jest.Mock;
  };
  let notificationsService: { notifyCommissionEarned: jest.Mock; notifyCommissionCredited: jest.Mock };

  beforeEach(() => {
    prisma = {
      payment: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      transaction: {
        create: jest.fn(),
      },
      order: {
        update: jest.fn(),
      },
      timeline: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    gateway = {
      verifyPaymentSignature: jest.fn(),
    };
    affiliateService = { validateEmployeeCode: jest.fn() };
    affiliateSettingsService = { get: jest.fn().mockResolvedValue({ commissionHoldPeriodDays: 7 }) };
    commissionService = {
      resolveAndFreezeCommission: jest.fn(),
      attachPaymentOp: jest.fn(),
      settleCommissionOnPaymentSuccess: jest.fn().mockResolvedValue(null),
    };
    notificationsService = {
      notifyCommissionEarned: jest.fn(),
      notifyCommissionCredited: jest.fn(),
    };
    service = new PaymentsService(
      prisma as unknown as PrismaService,
      gateway as unknown as RazorpayGateway,
      affiliateService as unknown as AffiliateService,
      affiliateSettingsService as unknown as AffiliateSettingsService,
      commissionService as unknown as CommissionService,
      notificationsService as unknown as NotificationsService,
    );
  });

  it('records a successful payment only after gateway signature verification', async () => {
    const payment = {
      id: 'payment-id',
      paymentNumber: 'PAY-001',
      status: PaymentStatusEnum.PENDING,
      amount: 25000,
      currency: 'INR',
      orderId: 'order-id',
      order: { clientId: 'client-id' },
    };
    const updatedPayment = { ...payment, status: PaymentStatusEnum.SUCCESSFUL };
    prisma.payment.findFirst.mockResolvedValue(payment);
    prisma.payment.update.mockResolvedValue(updatedPayment);
    // verifyPayment now uses an interactive transaction so the affiliate commission
    // can settle atomically alongside the payment/order writes.
    prisma.$transaction.mockImplementation(async (fn: any) => fn(prisma));
    gateway.verifyPaymentSignature.mockReturnValue({ isValid: true, transactionId: 'pay_123' });

    await expect(
      service.verifyPayment({
        razorpayOrderId: 'order_123',
        razorpayPaymentId: 'pay_123',
        razorpaySignature: 'valid-signature',
      }),
    ).resolves.toEqual(updatedPayment);

    expect(gateway.verifyPaymentSignature).toHaveBeenCalledWith('order_123', 'pay_123', 'valid-signature');
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
    expect(commissionService.settleCommissionOnPaymentSuccess).toHaveBeenCalledWith(
      prisma,
      'order-id',
      expect.objectContaining({ commissionHoldPeriodDays: 7 }),
    );
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-id' },
      data: { status: OrderStatusEnum.CONFIRMED },
    });
  });

  it('marks payment failed when gateway signature verification fails', async () => {
    prisma.payment.findFirst.mockResolvedValue({
      id: 'payment-id',
      status: PaymentStatusEnum.PENDING,
      amount: 25000,
      currency: 'INR',
      orderId: 'order-id',
      order: { clientId: 'client-id' },
    });
    gateway.verifyPaymentSignature.mockReturnValue({ isValid: false, transactionId: 'pay_123' });

    await expect(
      service.verifyPayment({
        razorpayOrderId: 'order_123',
        razorpayPaymentId: 'pay_123',
        razorpaySignature: 'bad-signature',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'PAYMENT_ATTEMPT',
        status: 'SIGNATURE_FAILED',
        paymentId: 'payment-id',
      }),
    });
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: 'payment-id' },
      data: { status: PaymentStatusEnum.FAILED },
    });
  });
});

import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayGateway } from '../payments/razorpay.provider';
import { WebhooksService } from './webhooks.service';
import { CommissionService } from '../affiliate/services/commission.service';
import { PaymentsService } from '../payments/payments.service';

type WebhookPrismaMock = {
  auditLog: {
    create: jest.Mock;
  };
  transaction: {
    findFirst: jest.Mock;
  };
};

describe('WebhooksService', () => {
  let prisma: WebhookPrismaMock;
  let gateway: jest.Mocked<Pick<RazorpayGateway, 'verifyWebhookSignature'>>;
  let paymentsService: jest.Mocked<Pick<PaymentsService, 'loadPaymentWithOrder' | 'finalizeSuccessfulPayment'>>;
  let service: WebhooksService;

  beforeEach(() => {
    prisma = {
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
      },
      transaction: {
        findFirst: jest.fn(),
      },
    };
    gateway = {
      verifyWebhookSignature: jest.fn(),
    };
    const configService = {
      get: jest.fn().mockReturnValue('webhook-secret'),
    };
    const commissionService = {
      reverseCommission: jest.fn().mockResolvedValue({ reversed: false }),
    };
    paymentsService = {
      loadPaymentWithOrder: jest.fn(),
      finalizeSuccessfulPayment: jest.fn(),
    } as any;
    service = new WebhooksService(
      prisma as unknown as PrismaService,
      gateway as unknown as RazorpayGateway,
      configService as unknown as ConfigService,
      commissionService as unknown as CommissionService,
      paymentsService as unknown as PaymentsService,
    );
  });

  it('rejects invalid Razorpay webhook signatures before processing JSON', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(false);

    await expect(service.handleRazorpayWebhook(Buffer.from('{not-json'), 'bad-signature')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('processes captured payments idempotently by delegating to the shared settlement path', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(true);
    prisma.transaction.findFirst.mockResolvedValue(null);
    const payment = { id: 'payment-id', orderId: 'order-id' };
    paymentsService.loadPaymentWithOrder.mockResolvedValue(payment as any);
    paymentsService.finalizeSuccessfulPayment.mockResolvedValue({ ...payment, status: 'SUCCESSFUL' } as any);

    const payload = Buffer.from(
      JSON.stringify({
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_123',
              order_id: 'order_123',
              amount: 2500000,
              currency: 'INR',
              method: 'upi',
              email: 'client@example.com',
            },
          },
        },
      }),
    );

    await expect(service.handleRazorpayWebhook(payload, 'valid-signature')).resolves.toEqual({
      processed: true,
      event: 'payment.captured',
    });

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
      where: { transactionId: 'pay_123' },
    });
    expect(paymentsService.loadPaymentWithOrder).toHaveBeenCalledWith('order_123');
    // finalizeSuccessfulPayment is the SAME method the client's own
    // POST /payments/verify calls — this is what guarantees subscription
    // creation and commission settlement run exactly once, no matter which of
    // the two paths (webhook or client verify) wins the race to get there first.
    expect(paymentsService.finalizeSuccessfulPayment).toHaveBeenCalledWith(payment, 'pay_123');

    paymentsService.finalizeSuccessfulPayment.mockClear();
    prisma.transaction.findFirst.mockResolvedValue({ id: 'existing-transaction' });

    await service.handleRazorpayWebhook(payload, 'valid-signature');

    expect(paymentsService.finalizeSuccessfulPayment).not.toHaveBeenCalled();
  });
});

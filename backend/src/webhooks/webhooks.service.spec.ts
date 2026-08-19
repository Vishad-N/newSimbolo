import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatusEnum, PaymentStatusEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InvoicesService } from '../invoices/invoices.service';
import { RazorpayGateway } from '../payments/razorpay.provider';
import { WebhooksService } from './webhooks.service';
import { CommissionService } from '../affiliate/services/commission.service';

type WebhookPrismaMock = {
  auditLog: {
    create: jest.Mock;
  };
  transaction: {
    findFirst: jest.Mock;
    create: jest.Mock;
  };
  payment: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
  order: {
    update: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('WebhooksService', () => {
  let prisma: WebhookPrismaMock;
  let gateway: jest.Mocked<Pick<RazorpayGateway, 'verifyWebhookSignature'>>;
  let invoicesService: jest.Mocked<Pick<InvoicesService, 'createFromOrder'>>;
  let service: WebhooksService;

  beforeEach(() => {
    prisma = {
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
      },
      transaction: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      payment: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      order: {
        update: jest.fn(),
      },
      $transaction: jest.fn().mockResolvedValue([]),
    };
    gateway = {
      verifyWebhookSignature: jest.fn(),
    };
    invoicesService = {
      createFromOrder: jest.fn().mockResolvedValue({}),
    };
    const configService = {
      get: jest.fn().mockReturnValue('webhook-secret'),
    };
    const commissionService = {
      reverseCommission: jest.fn().mockResolvedValue({ reversed: false }),
    };
    service = new WebhooksService(
      prisma as unknown as PrismaService,
      gateway as unknown as RazorpayGateway,
      configService as unknown as ConfigService,
      invoicesService as unknown as InvoicesService,
      commissionService as unknown as CommissionService,
    );
  });

  it('rejects invalid Razorpay webhook signatures before processing JSON', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(false);

    await expect(service.handleRazorpayWebhook(Buffer.from('{not-json'), 'bad-signature')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('processes captured payments idempotently', async () => {
    gateway.verifyWebhookSignature.mockReturnValue(true);
    prisma.transaction.findFirst.mockResolvedValue(null);
    prisma.payment.findFirst.mockResolvedValue({
      id: 'payment-id',
      orderId: 'order-id',
    });
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
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: 'payment-id' },
      data: expect.objectContaining({
        status: PaymentStatusEnum.SUCCESSFUL,
        gatewayTransactionId: 'pay_123',
      }),
    });
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-id' },
      data: { status: OrderStatusEnum.CONFIRMED },
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);

    prisma.$transaction.mockClear();
    prisma.transaction.findFirst.mockResolvedValue({ id: 'existing-transaction' });

    await service.handleRazorpayWebhook(payload, 'valid-signature');

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});

import { ForbiddenException } from '@nestjs/common';
import { OrderStatusEnum, PaymentStatusEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayGateway } from './razorpay.provider';
import { PaymentsService } from './payments.service';

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
    service = new PaymentsService(prisma as unknown as PrismaService, gateway as unknown as RazorpayGateway);
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
    prisma.$transaction.mockResolvedValue([updatedPayment]);
    gateway.verifyPaymentSignature.mockReturnValue({ isValid: true, transactionId: 'pay_123' });

    await expect(
      service.verifyPayment({
        razorpayOrderId: 'order_123',
        razorpayPaymentId: 'pay_123',
        razorpaySignature: 'valid-signature',
      }),
    ).resolves.toEqual(updatedPayment);

    expect(gateway.verifyPaymentSignature).toHaveBeenCalledWith('order_123', 'pay_123', 'valid-signature');
    expect(prisma.$transaction).toHaveBeenCalledWith([
      expect.objectContaining({}),
      expect.objectContaining({}),
      expect.objectContaining({}),
      expect.objectContaining({}),
    ]);
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

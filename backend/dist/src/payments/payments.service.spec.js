"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const payments_service_1 = require("./payments.service");
describe('PaymentsService', () => {
    let prisma;
    let gateway;
    let service;
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
        service = new payments_service_1.PaymentsService(prisma, gateway);
    });
    it('records a successful payment only after gateway signature verification', async () => {
        const payment = {
            id: 'payment-id',
            paymentNumber: 'PAY-001',
            status: client_1.PaymentStatusEnum.PENDING,
            amount: 25000,
            currency: 'INR',
            orderId: 'order-id',
            order: { clientId: 'client-id' },
        };
        const updatedPayment = { ...payment, status: client_1.PaymentStatusEnum.SUCCESSFUL };
        prisma.payment.findFirst.mockResolvedValue(payment);
        prisma.$transaction.mockResolvedValue([updatedPayment]);
        gateway.verifyPaymentSignature.mockReturnValue({ isValid: true, transactionId: 'pay_123' });
        await expect(service.verifyPayment({
            razorpayOrderId: 'order_123',
            razorpayPaymentId: 'pay_123',
            razorpaySignature: 'valid-signature',
        })).resolves.toEqual(updatedPayment);
        expect(gateway.verifyPaymentSignature).toHaveBeenCalledWith('order_123', 'pay_123', 'valid-signature');
        expect(prisma.$transaction).toHaveBeenCalledWith([
            expect.objectContaining({}),
            expect.objectContaining({}),
            expect.objectContaining({}),
            expect.objectContaining({}),
        ]);
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: 'order-id' },
            data: { status: client_1.OrderStatusEnum.CONFIRMED },
        });
    });
    it('marks payment failed when gateway signature verification fails', async () => {
        prisma.payment.findFirst.mockResolvedValue({
            id: 'payment-id',
            status: client_1.PaymentStatusEnum.PENDING,
            amount: 25000,
            currency: 'INR',
            orderId: 'order-id',
            order: { clientId: 'client-id' },
        });
        gateway.verifyPaymentSignature.mockReturnValue({ isValid: false, transactionId: 'pay_123' });
        await expect(service.verifyPayment({
            razorpayOrderId: 'order_123',
            razorpayPaymentId: 'pay_123',
            razorpaySignature: 'bad-signature',
        })).rejects.toBeInstanceOf(common_1.ForbiddenException);
        expect(prisma.transaction.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                type: 'PAYMENT_ATTEMPT',
                status: 'SIGNATURE_FAILED',
                paymentId: 'payment-id',
            }),
        });
        expect(prisma.payment.update).toHaveBeenCalledWith({
            where: { id: 'payment-id' },
            data: { status: client_1.PaymentStatusEnum.FAILED },
        });
    });
});
//# sourceMappingURL=payments.service.spec.js.map
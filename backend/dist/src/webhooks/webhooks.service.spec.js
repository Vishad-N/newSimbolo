"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const webhooks_service_1 = require("./webhooks.service");
describe('WebhooksService', () => {
    let prisma;
    let gateway;
    let service;
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
        const configService = {
            get: jest.fn().mockReturnValue('webhook-secret'),
        };
        service = new webhooks_service_1.WebhooksService(prisma, gateway, configService);
    });
    it('rejects invalid Razorpay webhook signatures before processing JSON', async () => {
        gateway.verifyWebhookSignature.mockReturnValue(false);
        await expect(service.handleRazorpayWebhook(Buffer.from('{not-json'), 'bad-signature')).rejects.toBeInstanceOf(common_1.BadRequestException);
        expect(prisma.auditLog.create).not.toHaveBeenCalled();
    });
    it('processes captured payments idempotently', async () => {
        gateway.verifyWebhookSignature.mockReturnValue(true);
        prisma.transaction.findFirst.mockResolvedValue(null);
        prisma.payment.findFirst.mockResolvedValue({
            id: 'payment-id',
            orderId: 'order-id',
        });
        const payload = Buffer.from(JSON.stringify({
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
        }));
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
                status: client_1.PaymentStatusEnum.SUCCESSFUL,
                gatewayTransactionId: 'pay_123',
            }),
        });
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: 'order-id' },
            data: { status: client_1.OrderStatusEnum.CONFIRMED },
        });
        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        prisma.$transaction.mockClear();
        prisma.transaction.findFirst.mockResolvedValue({ id: 'existing-transaction' });
        await service.handleRazorpayWebhook(payload, 'valid-signature');
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=webhooks.service.spec.js.map
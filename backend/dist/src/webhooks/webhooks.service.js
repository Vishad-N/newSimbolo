"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const razorpay_provider_1 = require("../payments/razorpay.provider");
const client_1 = require("@prisma/client");
let WebhooksService = class WebhooksService {
    prisma;
    razorpayGateway;
    configService;
    logger = new common_1.Logger('WebhooksService');
    webhookSecret;
    constructor(prisma, razorpayGateway, configService) {
        this.prisma = prisma;
        this.razorpayGateway = razorpayGateway;
        this.configService = configService;
        this.webhookSecret = this.configService.get('razorpay.webhookSecret', 'mock-razorpay-webhook-secret');
    }
    async handleRazorpayWebhook(rawBody, signature) {
        // Step 1: Validate signature
        const isValid = this.razorpayGateway.verifyWebhookSignature(rawBody, signature, this.webhookSecret);
        if (!isValid) {
            this.logger.warn('🚨 Invalid Razorpay webhook signature received');
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        let payload;
        try {
            payload = JSON.parse(rawBody.toString('utf8'));
        }
        catch {
            throw new common_1.BadRequestException('Invalid webhook JSON payload');
        }
        const eventName = payload?.event;
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
    async handlePaymentCaptured(entity) {
        if (!entity?.id)
            return;
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
                        status: client_1.PaymentStatusEnum.SUCCESSFUL,
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
                            data: { status: client_1.OrderStatusEnum.CONFIRMED },
                        }),
                    ]
                    : []),
            ]);
            this.logger.log(`✅ Webhook: Payment ${razorpayPaymentId} captured and recorded`);
        }
    }
    async handlePaymentFailed(entity) {
        if (!entity?.id || !entity?.order_id)
            return;
        const razorpayOrderId = entity.order_id;
        const payment = await this.prisma.payment.findFirst({
            where: { gatewayOrderId: razorpayOrderId },
        });
        if (payment && payment.status !== client_1.PaymentStatusEnum.FAILED) {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: client_1.PaymentStatusEnum.FAILED },
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
    async handleRefundProcessed(entity) {
        if (!entity?.payment_id)
            return;
        const payment = await this.prisma.payment.findFirst({
            where: { gatewayTransactionId: entity.payment_id },
        });
        if (payment) {
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: client_1.PaymentStatusEnum.REFUNDED },
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
        }
    }
    async handleSubscriptionCharged(entity) {
        if (!entity?.id)
            return;
        const razorpaySubscriptionId = entity.id;
        const subscription = await this.prisma.subscription.findFirst({
            where: { razorpaySubscriptionId },
        });
        if (subscription) {
            const newEnd = new Date(subscription.currentPeriodEnd);
            if (subscription.interval === 'MONTHLY')
                newEnd.setMonth(newEnd.getMonth() + 1);
            else if (subscription.interval === 'QUARTERLY')
                newEnd.setMonth(newEnd.getMonth() + 3);
            else
                newEnd.setFullYear(newEnd.getFullYear() + 1);
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
    async handleSubscriptionCancelled(entity) {
        if (!entity?.id)
            return;
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
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_provider_1.RazorpayGateway,
        config_1.ConfigService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map
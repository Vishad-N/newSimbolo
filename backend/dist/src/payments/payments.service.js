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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const razorpay_provider_1 = require("./razorpay.provider");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService extends base_service_1.BaseService {
    prisma;
    razorpayGateway;
    constructor(prisma, razorpayGateway) {
        super('PaymentsService');
        this.prisma = prisma;
        this.razorpayGateway = razorpayGateway;
    }
    generatePaymentNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `PAY-${timestamp}-${random}`;
    }
    generateTransactionId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TXN-${timestamp}-${random}`;
    }
    /**
     * Creates a Razorpay gateway order and a pending Payment record.
     * Never trusts client-side amount — fetches from DB.
     */
    async createPaymentOrder(dto, requesterId) {
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId, deletedAt: null },
            include: {
                client: { include: { user: { select: { email: true, firstName: true } } } },
            },
        });
        if (!order)
            throw new common_1.NotFoundException(`Order ${dto.orderId} not found`);
        const nonPayableStatuses = [client_1.OrderStatusEnum.COMPLETED, client_1.OrderStatusEnum.CANCELLED];
        if (nonPayableStatuses.includes(order.status)) {
            throw new common_1.BadRequestException(`Order ${order.orderNumber} cannot be paid in its current status`);
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
                status: client_1.PaymentStatusEnum.PENDING,
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
    async verifyPayment(dto, verifiedBy) {
        const payment = await this.prisma.payment.findFirst({
            where: { gatewayOrderId: dto.razorpayOrderId },
            include: { order: { include: { client: true } } },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`No payment found for Razorpay order: ${dto.razorpayOrderId}`);
        }
        if (payment.status === client_1.PaymentStatusEnum.SUCCESSFUL) {
            throw new common_1.BadRequestException('Payment already verified and recorded');
        }
        const { isValid, transactionId } = this.razorpayGateway.verifyPaymentSignature(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature);
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
                data: { status: client_1.PaymentStatusEnum.FAILED },
            });
            throw new common_1.ForbiddenException('Payment signature verification failed');
        }
        // Successful payment — update records
        const [updatedPayment] = await this.prisma.$transaction([
            this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: client_1.PaymentStatusEnum.SUCCESSFUL,
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
                where: { id: payment.orderId },
                data: { status: client_1.OrderStatusEnum.CONFIRMED },
            }),
            this.prisma.timeline.create({
                data: {
                    title: `Payment received`,
                    description: `Payment of ₹${payment.amount} ${payment.currency} received successfully`,
                    eventType: 'PAYMENT_RECEIVED',
                    orderId: payment.orderId ?? undefined,
                    clientId: payment.order?.clientId ?? undefined,
                    userId: verifiedBy ?? undefined,
                },
            }),
        ]);
        this.logger.log(`✅ Payment verified: ${payment.paymentNumber} (₹${payment.amount})`);
        return updatedPayment;
    }
    async findAll(clientId, status, page = 1, limit = 20) {
        const where = {};
        if (clientId) {
            // Scope to client's orders
            where.order = { clientId };
        }
        if (status)
            where.status = status;
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
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                order: true,
                invoice: true,
                transactions: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!payment)
            throw new common_1.NotFoundException(`Payment ${id} not found`);
        return payment;
    }
    async findMyPayments(userId, page = 1, limit = 20) {
        const clientProfile = await this.prisma.clientProfile.findFirst({
            where: { userId, deletedAt: null },
        });
        if (!clientProfile)
            throw new common_1.NotFoundException('Client profile not found');
        return this.findAll(clientProfile.id, undefined, page, limit);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_provider_1.RazorpayGateway])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map
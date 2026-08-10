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
exports.RazorpayGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const Razorpay = require('razorpay');
const base_service_1 = require("../shared/abstractions/base.service");
/**
 * Razorpay implementation of IPaymentGateway.
 * Uses mock mode when credentials are not real, matching the EmailService pattern.
 */
let RazorpayGateway = class RazorpayGateway extends base_service_1.BaseService {
    configService;
    keyId;
    keySecret;
    isMockMode;
    razorpayInstance = null;
    constructor(configService) {
        super('RazorpayGateway');
        this.configService = configService;
        this.keyId = this.configService.get('razorpay.keyId', 'mock-razorpay-key-id');
        this.keySecret = this.configService.get('razorpay.keySecret', 'mock-razorpay-key-secret');
        this.isMockMode = this.keyId.startsWith('mock-') || this.keyId.startsWith('rzp_test_') === false;
        if (!this.isMockMode) {
            this.razorpayInstance = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
            this.logger.log('💳 Razorpay gateway initialized in LIVE mode');
        }
        else {
            this.logger.warn('💳 Razorpay gateway running in MOCK mode (no real credentials configured)');
        }
    }
    async createOrder(amount, currency, receipt) {
        if (this.isMockMode) {
            const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            this.logger.log(`💳 [MOCK] Created Razorpay order: ${mockOrderId} for ₹${amount / 100}`);
            return {
                gatewayOrderId: mockOrderId,
                amount,
                currency,
                receipt,
                status: 'created',
                provider: 'RAZORPAY',
            };
        }
        // Amount must be in paise (smallest unit)
        const order = await this.razorpayInstance.orders.create({
            amount: Math.round(amount * 100),
            currency,
            receipt,
        });
        return {
            gatewayOrderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
            provider: 'RAZORPAY',
        };
    }
    verifyPaymentSignature(orderId, paymentId, signature) {
        if (this.isMockMode) {
            // In mock mode, accept any signature that is 'mock-signature'
            const isValid = signature === 'mock-signature';
            this.logger.log(`💳 [MOCK] Payment signature verification: ${isValid ? 'VALID' : 'INVALID'}`);
            return { isValid, transactionId: paymentId };
        }
        // Real HMAC-SHA256 verification — NEVER trust client-side status
        const expectedSignature = crypto
            .createHmac('sha256', this.keySecret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');
        const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(signature, 'hex'));
        return { isValid, transactionId: paymentId };
    }
    /**
     * Verifies inbound webhook signature from Razorpay.
     * Uses HMAC-SHA256 over the raw body bytes.
     */
    verifyWebhookSignature(rawBody, signature, webhookSecret) {
        if (this.isMockMode) {
            this.logger.log('💳 [MOCK] Webhook signature verification bypassed in mock mode');
            return signature === 'mock-webhook-signature' || signature === 'mock-signature';
        }
        const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
        const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(signature, 'hex'));
        if (!isValid) {
            this.logger.error(`Webhook signature mismatch! Expected: ${expectedSignature}, Received: ${signature}. Body length: ${rawBody.length}`);
        }
        return isValid;
    }
};
exports.RazorpayGateway = RazorpayGateway;
exports.RazorpayGateway = RazorpayGateway = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RazorpayGateway);
//# sourceMappingURL=razorpay.provider.js.map
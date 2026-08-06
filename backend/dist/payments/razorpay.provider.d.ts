import { ConfigService } from '@nestjs/config';
import { BaseService } from '../shared/abstractions/base.service';
/**
 * Provider-agnostic payment gateway interface.
 * Designed so additional providers (Stripe, PayPal) can be added later
 * without touching the core payments business logic.
 */
export interface GatewayOrderResult {
    gatewayOrderId: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    provider: string;
}
export interface GatewayVerifyResult {
    isValid: boolean;
    transactionId: string;
}
export interface IPaymentGateway {
    createOrder(amount: number, currency: string, receipt: string): Promise<GatewayOrderResult>;
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): GatewayVerifyResult;
}
/**
 * Razorpay implementation of IPaymentGateway.
 * Uses mock mode when credentials are not real, matching the EmailService pattern.
 */
export declare class RazorpayGateway extends BaseService implements IPaymentGateway {
    private readonly configService;
    private readonly keyId;
    private readonly keySecret;
    private readonly isMockMode;
    private razorpayInstance;
    constructor(configService: ConfigService);
    createOrder(amount: number, currency: string, receipt: string): Promise<GatewayOrderResult>;
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): GatewayVerifyResult;
    /**
     * Verifies inbound webhook signature from Razorpay.
     * Uses HMAC-SHA256 over the raw body bytes.
     */
    verifyWebhookSignature(rawBody: Buffer, signature: string, webhookSecret: string): boolean;
}

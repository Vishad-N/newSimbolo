import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');
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
@Injectable()
export class RazorpayGateway extends BaseService implements IPaymentGateway {
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly isMockMode: boolean;
  private razorpayInstance: any = null;

  constructor(private readonly configService: ConfigService) {
    super('RazorpayGateway');
    this.keyId = this.configService.get<string>('razorpay.keyId', 'mock-razorpay-key-id');
    this.keySecret = this.configService.get<string>('razorpay.keySecret', 'mock-razorpay-key-secret');
    // A real Razorpay key ID is always "rzp_test_..." or "rzp_live_..." — the previous
    // check only accepted "rzp_test_", which meant a real LIVE key would incorrectly
    // fall through to mock mode and silently never process a real payment.
    this.isMockMode = !this.keyId || this.keyId.startsWith('mock-');

    if (!this.isMockMode) {
      this.razorpayInstance = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
      this.logger.log('💳 Razorpay gateway initialized in LIVE mode');
    } else {
      this.logger.warn('💳 Razorpay gateway running in MOCK mode (no real credentials configured)');
    }
  }

  async createOrder(amount: number, currency: string, receipt: string): Promise<GatewayOrderResult> {
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

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): GatewayVerifyResult {
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
  verifyWebhookSignature(rawBody: Buffer, signature: string, webhookSecret: string): boolean {
    if (this.isMockMode) {
      this.logger.log('💳 [MOCK] Webhook signature verification bypassed in mock mode');
      return signature === 'mock-webhook-signature' || signature === 'mock-signature';
    }

    const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

    const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(signature, 'hex'));

    if (!isValid) {
      this.logger.error(
        `Webhook signature mismatch! Expected: ${expectedSignature}, Received: ${signature}. Body length: ${rawBody.length}`,
      );
    }

    return isValid;
  }
}

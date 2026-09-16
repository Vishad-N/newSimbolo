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
 * Requires real credentials — there is no mock/test fallback in this provider.
 */
@Injectable()
export class RazorpayGateway extends BaseService implements IPaymentGateway {
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly razorpayInstance: any;

  constructor(private readonly configService: ConfigService) {
    super('RazorpayGateway');
    this.keyId = this.configService.get<string>('razorpay.keyId', '');
    this.keySecret = this.configService.get<string>('razorpay.keySecret', '');

    if (!this.keyId || !this.keySecret) {
      throw new Error(
        'Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      );
    }

    this.razorpayInstance = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
    this.logger.log('💳 Razorpay gateway initialized in LIVE mode');
  }

  async createOrder(amount: number, currency: string, receipt: string): Promise<GatewayOrderResult> {
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

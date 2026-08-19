import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { BaseService } from '../../shared/abstractions/base.service';

export interface PayoutContactResult {
  contactId: string;
}

export interface PayoutFundAccountResult {
  fundAccountId: string;
}

export interface PayoutResult {
  payoutId: string;
  status: string;
}

export interface CreateContactInput {
  name: string;
  email?: string;
  contact?: string;
  referenceId: string;
}

export interface CreateFundAccountInput {
  contactId: string;
  type: 'bank_account' | 'vpa';
  accountNumber?: string;
  ifsc?: string;
  accountHolderName?: string;
  upiId?: string;
}

/**
 * Provider-agnostic payout gateway interface, mirroring IPaymentGateway so a second
 * payout provider can be dropped in without touching withdrawal business logic.
 */
export interface IPayoutGateway {
  createContact(input: CreateContactInput): Promise<PayoutContactResult>;
  createFundAccount(input: CreateFundAccountInput): Promise<PayoutFundAccountResult>;
  createPayout(
    withdrawalId: string,
    amount: number,
    fundAccountId: string,
    idempotencyKey: string,
  ): Promise<PayoutResult>;
  verifyWebhookSignature(rawBody: Buffer, signature: string): boolean;
}

/**
 * RazorpayX implementation.
 *
 * Mock mode (no real credentials configured) mirrors the RazorpayGateway convention:
 * every call is simulated locally so the whole payout flow is exercisable without
 * touching a live banking API.
 */
@Injectable()
export class RazorpayXGateway extends BaseService implements IPayoutGateway {
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly accountNumber: string;
  private readonly webhookSecret: string;
  private readonly isMockMode: boolean;
  private static readonly API_BASE = 'https://api.razorpay.com/v1';

  constructor(private readonly configService: ConfigService) {
    super('RazorpayXGateway');
    this.keyId = this.configService.get<string>('razorpayx.keyId', 'mock-razorpayx-key-id');
    this.keySecret = this.configService.get<string>('razorpayx.keySecret', 'mock-razorpayx-key-secret');
    this.accountNumber = this.configService.get<string>('razorpayx.accountNumber', 'mock-razorpayx-account-number');
    this.webhookSecret = this.configService.get<string>('razorpayx.webhookSecret', 'mock-razorpayx-webhook-secret');
    this.isMockMode = this.keyId.startsWith('mock-') || !this.keyId.startsWith('rzp_');

    if (this.isMockMode) {
      this.logger.warn('🏦 RazorpayX payouts running in MOCK mode (no real credentials configured)');
    } else {
      this.logger.log('🏦 RazorpayX payouts initialized in LIVE mode');
    }
  }

  get mockMode(): boolean {
    return this.isMockMode;
  }

  private authHeader(): string {
    return `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`;
  }

  private async request<T>(path: string, body: Record<string, unknown>, idempotencyKey?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: this.authHeader(),
    };
    if (idempotencyKey) headers['X-Payout-Idempotency'] = idempotencyKey;

    const response = await fetch(`${RazorpayXGateway.API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = (await response.json()) as any;
    if (!response.ok) {
      const message = json?.error?.description ?? `RazorpayX request failed with status ${response.status}`;
      this.logger.error(`RazorpayX ${path} failed: ${message}`);
      throw new Error(message);
    }
    return json as T;
  }

  async createContact(input: CreateContactInput): Promise<PayoutContactResult> {
    if (this.isMockMode) {
      const contactId = `cont_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      this.logger.log(`🏦 [MOCK] Created RazorpayX contact ${contactId}`);
      return { contactId };
    }

    const result = await this.request<{ id: string }>('/contacts', {
      name: input.name,
      email: input.email,
      contact: input.contact,
      type: 'employee',
      reference_id: input.referenceId,
    });
    return { contactId: result.id };
  }

  async createFundAccount(input: CreateFundAccountInput): Promise<PayoutFundAccountResult> {
    if (this.isMockMode) {
      const fundAccountId = `fa_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      this.logger.log(`🏦 [MOCK] Created RazorpayX fund account ${fundAccountId}`);
      return { fundAccountId };
    }

    const body: Record<string, unknown> =
      input.type === 'bank_account'
        ? {
            contact_id: input.contactId,
            account_type: 'bank_account',
            bank_account: {
              name: input.accountHolderName,
              ifsc: input.ifsc,
              account_number: input.accountNumber,
            },
          }
        : {
            contact_id: input.contactId,
            account_type: 'vpa',
            vpa: { address: input.upiId },
          };

    const result = await this.request<{ id: string }>('/fund_accounts', body);
    return { fundAccountId: result.id };
  }

  /**
   * Initiates a payout. `idempotencyKey` is forwarded as RazorpayX's
   * X-Payout-Idempotency header so a retried request can never pay out twice.
   * `amount` is in rupees and converted to paise here.
   */
  async createPayout(
    withdrawalId: string,
    amount: number,
    fundAccountId: string,
    idempotencyKey: string,
  ): Promise<PayoutResult> {
    if (this.isMockMode) {
      const payoutId = `pout_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      this.logger.log(`🏦 [MOCK] Created RazorpayX payout ${payoutId} for ₹${amount} (withdrawal ${withdrawalId})`);
      return { payoutId, status: 'processing' };
    }

    const result = await this.request<{ id: string; status: string }>(
      '/payouts',
      {
        account_number: this.accountNumber,
        fund_account_id: fundAccountId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        mode: 'IMPS',
        purpose: 'payout',
        queue_if_low_balance: true,
        reference_id: withdrawalId,
        narration: 'Sales commission payout',
      },
      idempotencyKey,
    );

    return { payoutId: result.id, status: result.status };
  }

  verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
    if (this.isMockMode) {
      this.logger.log('🏦 [MOCK] RazorpayX webhook signature verification bypassed');
      return signature === 'mock-webhook-signature' || signature === 'mock-signature';
    }

    if (!signature) return false;

    const expected = crypto.createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
    } catch {
      // Length mismatch / non-hex input — treat as invalid rather than throwing.
      return false;
    }
  }
}

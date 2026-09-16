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
 * Requires real credentials to actually process payouts — there is no mock/test
 * fallback. Unlike RazorpayGateway, missing credentials do NOT crash the app at
 * startup (RazorpayXGateway is wired into the always-loaded AffiliateModule, so
 * that would take down the whole backend); instead the gateway starts in a
 * `configured: false` state and every operation fails with a clear error until
 * RAZORPAYX_KEY_ID / RAZORPAYX_KEY_SECRET / RAZORPAYX_ACCOUNT_NUMBER /
 * RAZORPAYX_WEBHOOK_SECRET are set.
 */
@Injectable()
export class RazorpayXGateway extends BaseService implements IPayoutGateway {
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly accountNumber: string;
  private readonly webhookSecret: string;
  private readonly configured: boolean;
  private static readonly API_BASE = 'https://api.razorpay.com/v1';

  constructor(private readonly configService: ConfigService) {
    super('RazorpayXGateway');
    this.keyId = this.configService.get<string>('razorpayx.keyId', '');
    this.keySecret = this.configService.get<string>('razorpayx.keySecret', '');
    this.accountNumber = this.configService.get<string>('razorpayx.accountNumber', '');
    this.webhookSecret = this.configService.get<string>('razorpayx.webhookSecret', '');
    this.configured = Boolean(this.keyId && this.keySecret && this.accountNumber && this.webhookSecret);

    if (this.configured) {
      this.logger.log('🏦 RazorpayX payouts initialized in LIVE mode');
    } else {
      // TODO(razorpayx): apply for RazorpayX access and set the 4 env vars above to enable payouts.
      this.logger.warn(
        '⚠️  TODO: RazorpayX is NOT configured — affiliate/sales-employee commission payouts are disabled. ' +
          'Set RAZORPAYX_KEY_ID, RAZORPAYX_KEY_SECRET, RAZORPAYX_ACCOUNT_NUMBER and RAZORPAYX_WEBHOOK_SECRET once RazorpayX approval is done.',
      );
    }
  }

  private assertConfigured(): void {
    if (!this.configured) {
      throw new Error(
        'RazorpayX is not configured yet. Set RAZORPAYX_KEY_ID, RAZORPAYX_KEY_SECRET, RAZORPAYX_ACCOUNT_NUMBER and RAZORPAYX_WEBHOOK_SECRET to enable payouts.',
      );
    }
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
    this.assertConfigured();
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
    this.assertConfigured();
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
    this.assertConfigured();
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
    if (!this.configured || !signature) return false;

    const expected = crypto.createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
    } catch {
      // Length mismatch / non-hex input — treat as invalid rather than throwing.
      return false;
    }
  }
}

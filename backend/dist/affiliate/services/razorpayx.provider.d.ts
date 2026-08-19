import { ConfigService } from '@nestjs/config';
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
    createPayout(withdrawalId: string, amount: number, fundAccountId: string, idempotencyKey: string): Promise<PayoutResult>;
    verifyWebhookSignature(rawBody: Buffer, signature: string): boolean;
}
/**
 * RazorpayX implementation.
 *
 * Mock mode (no real credentials configured) mirrors the RazorpayGateway convention:
 * every call is simulated locally so the whole payout flow is exercisable without
 * touching a live banking API.
 */
export declare class RazorpayXGateway extends BaseService implements IPayoutGateway {
    private readonly configService;
    private readonly keyId;
    private readonly keySecret;
    private readonly accountNumber;
    private readonly webhookSecret;
    private readonly isMockMode;
    private static readonly API_BASE;
    constructor(configService: ConfigService);
    get mockMode(): boolean;
    private authHeader;
    private request;
    createContact(input: CreateContactInput): Promise<PayoutContactResult>;
    createFundAccount(input: CreateFundAccountInput): Promise<PayoutFundAccountResult>;
    /**
     * Initiates a payout. `idempotencyKey` is forwarded as RazorpayX's
     * X-Payout-Idempotency header so a retried request can never pay out twice.
     * `amount` is in rupees and converted to paise here.
     */
    createPayout(withdrawalId: string, amount: number, fundAccountId: string, idempotencyKey: string): Promise<PayoutResult>;
    verifyWebhookSignature(rawBody: Buffer, signature: string): boolean;
}

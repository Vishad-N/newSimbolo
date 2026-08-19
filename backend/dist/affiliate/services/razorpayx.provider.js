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
var RazorpayXGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayXGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const base_service_1 = require("../../shared/abstractions/base.service");
/**
 * RazorpayX implementation.
 *
 * Mock mode (no real credentials configured) mirrors the RazorpayGateway convention:
 * every call is simulated locally so the whole payout flow is exercisable without
 * touching a live banking API.
 */
let RazorpayXGateway = class RazorpayXGateway extends base_service_1.BaseService {
    static { RazorpayXGateway_1 = this; }
    configService;
    keyId;
    keySecret;
    accountNumber;
    webhookSecret;
    isMockMode;
    static API_BASE = 'https://api.razorpay.com/v1';
    constructor(configService) {
        super('RazorpayXGateway');
        this.configService = configService;
        this.keyId = this.configService.get('razorpayx.keyId', 'mock-razorpayx-key-id');
        this.keySecret = this.configService.get('razorpayx.keySecret', 'mock-razorpayx-key-secret');
        this.accountNumber = this.configService.get('razorpayx.accountNumber', 'mock-razorpayx-account-number');
        this.webhookSecret = this.configService.get('razorpayx.webhookSecret', 'mock-razorpayx-webhook-secret');
        this.isMockMode = this.keyId.startsWith('mock-') || !this.keyId.startsWith('rzp_');
        if (this.isMockMode) {
            this.logger.warn('🏦 RazorpayX payouts running in MOCK mode (no real credentials configured)');
        }
        else {
            this.logger.log('🏦 RazorpayX payouts initialized in LIVE mode');
        }
    }
    get mockMode() {
        return this.isMockMode;
    }
    authHeader() {
        return `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`;
    }
    async request(path, body, idempotencyKey) {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: this.authHeader(),
        };
        if (idempotencyKey)
            headers['X-Payout-Idempotency'] = idempotencyKey;
        const response = await fetch(`${RazorpayXGateway_1.API_BASE}${path}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
        const json = (await response.json());
        if (!response.ok) {
            const message = json?.error?.description ?? `RazorpayX request failed with status ${response.status}`;
            this.logger.error(`RazorpayX ${path} failed: ${message}`);
            throw new Error(message);
        }
        return json;
    }
    async createContact(input) {
        if (this.isMockMode) {
            const contactId = `cont_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            this.logger.log(`🏦 [MOCK] Created RazorpayX contact ${contactId}`);
            return { contactId };
        }
        const result = await this.request('/contacts', {
            name: input.name,
            email: input.email,
            contact: input.contact,
            type: 'employee',
            reference_id: input.referenceId,
        });
        return { contactId: result.id };
    }
    async createFundAccount(input) {
        if (this.isMockMode) {
            const fundAccountId = `fa_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            this.logger.log(`🏦 [MOCK] Created RazorpayX fund account ${fundAccountId}`);
            return { fundAccountId };
        }
        const body = input.type === 'bank_account'
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
        const result = await this.request('/fund_accounts', body);
        return { fundAccountId: result.id };
    }
    /**
     * Initiates a payout. `idempotencyKey` is forwarded as RazorpayX's
     * X-Payout-Idempotency header so a retried request can never pay out twice.
     * `amount` is in rupees and converted to paise here.
     */
    async createPayout(withdrawalId, amount, fundAccountId, idempotencyKey) {
        if (this.isMockMode) {
            const payoutId = `pout_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            this.logger.log(`🏦 [MOCK] Created RazorpayX payout ${payoutId} for ₹${amount} (withdrawal ${withdrawalId})`);
            return { payoutId, status: 'processing' };
        }
        const result = await this.request('/payouts', {
            account_number: this.accountNumber,
            fund_account_id: fundAccountId,
            amount: Math.round(amount * 100),
            currency: 'INR',
            mode: 'IMPS',
            purpose: 'payout',
            queue_if_low_balance: true,
            reference_id: withdrawalId,
            narration: 'Sales commission payout',
        }, idempotencyKey);
        return { payoutId: result.id, status: result.status };
    }
    verifyWebhookSignature(rawBody, signature) {
        if (this.isMockMode) {
            this.logger.log('🏦 [MOCK] RazorpayX webhook signature verification bypassed');
            return signature === 'mock-webhook-signature' || signature === 'mock-signature';
        }
        if (!signature)
            return false;
        const expected = crypto.createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
        try {
            return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
        }
        catch {
            // Length mismatch / non-hex input — treat as invalid rather than throwing.
            return false;
        }
    }
};
exports.RazorpayXGateway = RazorpayXGateway;
exports.RazorpayXGateway = RazorpayXGateway = RazorpayXGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RazorpayXGateway);
//# sourceMappingURL=razorpayx.provider.js.map
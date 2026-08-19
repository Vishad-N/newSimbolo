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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayXWebhookController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_service_1 = require("../../shared/abstractions/base.service");
const wallet_service_1 = require("../services/wallet.service");
const razorpayx_provider_1 = require("../services/razorpayx.provider");
const withdrawal_service_1 = require("../services/withdrawal.service");
/**
 * Inbound RazorpayX payout webhook.
 *
 * Public (no JWT) — authenticated by HMAC-SHA256 over the RAW request body, which
 * requires RawBodyMiddleware to be applied to this route in AppModule.
 *
 * Idempotency: every event is claimed by inserting into WebhookEvent (eventId is
 * @unique). A P2002 on that insert means the event was already received, so we
 * acknowledge with 200 and do no further processing. Razorpay retries aggressively,
 * so this guard is what stops a double-debit.
 */
let RazorpayXWebhookController = class RazorpayXWebhookController extends base_service_1.BaseService {
    prisma;
    razorpayx;
    withdrawalService;
    walletService;
    constructor(prisma, razorpayx, withdrawalService, walletService) {
        super('RazorpayXWebhookController');
        this.prisma = prisma;
        this.razorpayx = razorpayx;
        this.withdrawalService = withdrawalService;
        this.walletService = walletService;
    }
    async handle(signature, req) {
        const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
        if (!this.razorpayx.verifyWebhookSignature(rawBody, signature ?? '')) {
            this.logger.warn('🚨 Invalid RazorpayX webhook signature received');
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        let payload;
        try {
            payload = JSON.parse(rawBody.toString('utf8'));
        }
        catch {
            throw new common_1.BadRequestException('Invalid webhook JSON payload');
        }
        const eventType = payload?.event ?? 'unknown';
        const payoutEntity = payload?.payload?.payout?.entity;
        // Razorpay sends `x-razorpay-event-id`; fall back to a deterministic key so the
        // uniqueness guard still works if the header is absent.
        const eventId = req.headers['x-razorpay-event-id'] ??
            `${eventType}:${payoutEntity?.id ?? 'unknown'}:${payload?.created_at ?? ''}`;
        // Claim the event — this INSERT is the idempotency boundary.
        try {
            await this.prisma.webhookEvent.create({
                data: { provider: 'RAZORPAYX', eventId, eventType, payload },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                this.logger.log(`🔄 Idempotent skip: RazorpayX event ${eventId} already processed`);
                return { processed: false, duplicate: true, event: eventType };
            }
            throw error;
        }
        let processingError;
        try {
            await this.route(eventType, payoutEntity);
        }
        catch (error) {
            processingError = error.message;
            this.logger.error(`RazorpayX webhook ${eventType} processing failed: ${processingError}`);
        }
        await this.prisma.webhookEvent.update({
            where: { eventId },
            data: { processed: !processingError, processedAt: new Date(), error: processingError ?? null },
        });
        return { processed: !processingError, event: eventType };
    }
    async route(eventType, entity) {
        if (!entity?.id) {
            this.logger.warn(`RazorpayX webhook ${eventType} carried no payout entity — ignoring`);
            return;
        }
        const withdrawal = await this.withdrawalService.findByRazorpayPayoutId(entity.id);
        if (!withdrawal) {
            this.logger.warn(`RazorpayX webhook ${eventType}: no withdrawal for payout ${entity.id}`);
            return;
        }
        switch (eventType) {
            case 'payout.processed':
                await this.withdrawalService.markPaidFromWebhook(withdrawal.id, entity.id, withdrawal.affiliate.userId, withdrawal.amount);
                break;
            case 'payout.failed':
            case 'payout.rejected':
                await this.withdrawalService.markFailedFromWebhook(withdrawal.id, entity.failure_reason ?? entity.status_details?.description ?? 'Payout failed at RazorpayX', withdrawal.affiliate.userId, withdrawal.amount);
                break;
            case 'payout.reversed':
                await this.walletService.reverseWithdrawalPayout(withdrawal.id, entity.failure_reason ?? 'Payout reversed by RazorpayX');
                break;
            default:
                this.logger.log(`RazorpayX webhook event ${eventType} not handled — recorded and ignored`);
        }
    }
};
exports.RazorpayXWebhookController = RazorpayXWebhookController;
__decorate([
    (0, common_1.Post)('razorpayx'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'RazorpayX inbound payout webhook',
        description: 'Handles payout.processed / payout.failed / payout.reversed. Signature-verified and idempotent.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook accepted' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid signature or payload' }),
    __param(0, (0, common_1.Headers)('x-razorpay-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RazorpayXWebhookController.prototype, "handle", null);
exports.RazorpayXWebhookController = RazorpayXWebhookController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpayx_provider_1.RazorpayXGateway,
        withdrawal_service_1.WithdrawalService,
        wallet_service_1.WalletService])
], RazorpayXWebhookController);
//# sourceMappingURL=razorpayx-webhook.controller.js.map
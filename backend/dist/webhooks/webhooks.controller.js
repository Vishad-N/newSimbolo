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
exports.WebhooksController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const webhooks_service_1 = require("./webhooks.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let WebhooksController = class WebhooksController {
    webhooksService;
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    /**
     * Razorpay webhook endpoint.
     * Public (no JWT) — authentication via HMAC-SHA256 signature validation.
     * Requires raw body for signature verification.
     */
    handleRazorpayWebhook(signature, req) {
        if (!req.rawBody) {
            console.warn('⚠️ req.rawBody is undefined! Falling back to JSON.stringify(req.body). This will likely fail signature validation.');
        }
        const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
        return this.webhooksService.handleRazorpayWebhook(rawBody, signature ?? '');
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Razorpay inbound webhook',
        description: 'Receives payment/subscription events from Razorpay. Validates HMAC-SHA256 signature using the webhook secret. Processes events idempotently.' }),
    (0, common_1.Post)('razorpay'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid signature or payload' }),
    __param(0, (0, common_1.Headers)('x-razorpay-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "handleRazorpayWebhook", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map
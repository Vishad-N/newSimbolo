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
exports.AffiliateMeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_payout_method_dto_1 = require("../dto/create-payout-method.dto");
const request_withdrawal_dto_1 = require("../dto/request-withdrawal.dto");
const affiliate_service_1 = require("../services/affiliate.service");
const payout_method_service_1 = require("../services/payout-method.service");
const wallet_service_1 = require("../services/wallet.service");
const withdrawal_service_1 = require("../services/withdrawal.service");
/**
 * Self-service surface for sales employees.
 *
 * SECURITY: every route resolves the caller's own Affiliate row from the JWT `sub`.
 * No route accepts an affiliateId/employeeId from the client, so one employee can
 * never read or act on another's wallet, commissions or payout methods.
 */
let AffiliateMeController = class AffiliateMeController {
    affiliateService;
    walletService;
    withdrawalService;
    payoutMethodService;
    constructor(affiliateService, walletService, withdrawalService, payoutMethodService) {
        this.affiliateService = affiliateService;
        this.walletService = walletService;
        this.withdrawalService = withdrawalService;
        this.payoutMethodService = payoutMethodService;
    }
    getMe(user) {
        return this.affiliateService.getMyProfile(user.sub);
    }
    getMySales(user, page, limit) {
        return this.affiliateService.getMySales(user.sub, page, limit);
    }
    getMyCommissions(user, page, limit, status) {
        return this.affiliateService.getMyCommissions(user.sub, page, limit, status);
    }
    async getMyWallet(user) {
        const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
        return this.walletService.getWalletByAffiliateId(affiliate.id);
    }
    async getMyWalletTransactions(user, page, limit) {
        const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
        const wallet = await this.walletService.getWalletByAffiliateId(affiliate.id);
        return this.walletService.listTransactions(wallet.id, page, limit);
    }
    async getMyWithdrawals(user, page, limit, status) {
        const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
        return this.withdrawalService.list({ affiliateId: affiliate.id, status, page, limit });
    }
    async requestWithdrawal(user, dto) {
        const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
        return this.withdrawalService.requestWithdrawal(affiliate.id, dto, user.sub);
    }
    async getMyPayoutMethods(user) {
        const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
        return this.payoutMethodService.list(affiliate.id);
    }
    async createPayoutMethod(user, dto) {
        const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
        return this.payoutMethodService.create(affiliate.id, dto, user.sub);
    }
    async updatePayoutMethod(user, id, dto) {
        const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
        return this.payoutMethodService.update(affiliate.id, id, dto, user.sub);
    }
    async removePayoutMethod(user, id) {
        const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
        return this.payoutMethodService.remove(affiliate.id, id, user.sub);
    }
};
exports.AffiliateMeController = AffiliateMeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my sales employee profile and headline stats' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AffiliateMeController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'List orders I have been attributed for' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], AffiliateMeController.prototype, "getMySales", null);
__decorate([
    (0, common_1.Get)('commissions'),
    (0, swagger_1.ApiOperation)({ summary: 'List my commissions' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.CommissionStatusEnum }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", void 0)
], AffiliateMeController.prototype, "getMyCommissions", null);
__decorate([
    (0, common_1.Get)('wallet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my wallet balances' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AffiliateMeController.prototype, "getMyWallet", null);
__decorate([
    (0, common_1.Get)('wallet/transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my wallet ledger' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], AffiliateMeController.prototype, "getMyWalletTransactions", null);
__decorate([
    (0, common_1.Get)('withdrawals'),
    (0, swagger_1.ApiOperation)({ summary: 'List my withdrawal requests' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.WithdrawalStatusEnum }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], AffiliateMeController.prototype, "getMyWithdrawals", null);
__decorate([
    (0, common_1.Post)('withdrawals'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a withdrawal from my available wallet balance' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_withdrawal_dto_1.RequestWithdrawalDto]),
    __metadata("design:returntype", Promise)
], AffiliateMeController.prototype, "requestWithdrawal", null);
__decorate([
    (0, common_1.Get)('payout-methods'),
    (0, swagger_1.ApiOperation)({ summary: 'List my payout methods (masked)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AffiliateMeController.prototype, "getMyPayoutMethods", null);
__decorate([
    (0, common_1.Post)('payout-methods'),
    (0, swagger_1.ApiOperation)({
        summary: 'Add a payout method',
        description: 'Full account/UPI details are forwarded to RazorpayX and never persisted — only a mask is stored.',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payout_method_dto_1.CreatePayoutMethodDto]),
    __metadata("design:returntype", Promise)
], AffiliateMeController.prototype, "createPayoutMethod", null);
__decorate([
    (0, common_1.Put)('payout-methods/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update one of my payout methods' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_payout_method_dto_1.UpdatePayoutMethodDto]),
    __metadata("design:returntype", Promise)
], AffiliateMeController.prototype, "updatePayoutMethod", null);
__decorate([
    (0, common_1.Delete)('payout-methods/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove one of my payout methods' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AffiliateMeController.prototype, "removePayoutMethod", null);
exports.AffiliateMeController = AffiliateMeController = __decorate([
    (0, swagger_1.ApiTags)('Affiliate (Self)'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('affiliate/me'),
    __metadata("design:paramtypes", [affiliate_service_1.AffiliateService,
        wallet_service_1.WalletService,
        withdrawal_service_1.WithdrawalService,
        payout_method_service_1.PayoutMethodService])
], AffiliateMeController);
//# sourceMappingURL=affiliate-me.controller.js.map
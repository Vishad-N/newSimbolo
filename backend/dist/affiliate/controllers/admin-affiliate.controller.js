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
exports.AdminAffiliateController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const admin_list_query_dto_1 = require("../dto/admin-list-query.dto");
const request_withdrawal_dto_1 = require("../dto/request-withdrawal.dto");
const update_affiliate_settings_dto_1 = require("../dto/update-affiliate-settings.dto");
const affiliate_settings_service_1 = require("../services/affiliate-settings.service");
const affiliate_service_1 = require("../services/affiliate.service");
const commission_sweep_service_1 = require("../services/commission-sweep.service");
const withdrawal_service_1 = require("../services/withdrawal.service");
let AdminAffiliateController = class AdminAffiliateController {
    affiliateService;
    withdrawalService;
    settingsService;
    sweepService;
    constructor(affiliateService, withdrawalService, settingsService, sweepService) {
        this.affiliateService = affiliateService;
        this.withdrawalService = withdrawalService;
        this.settingsService = settingsService;
        this.sweepService = sweepService;
    }
    // ── Employees ─────────────────────────────────────────────────────────────
    listEmployees(query) {
        return this.affiliateService.listEmployees(query);
    }
    getEmployee(id) {
        return this.affiliateService.getEmployee(id);
    }
    createEmployee(dto, user) {
        return this.affiliateService.createEmployee(dto, { actorUserId: user?.sub });
    }
    activate(id, user) {
        return this.affiliateService.setEmployeeStatus(id, client_1.AffiliateStatusEnum.ACTIVE, user?.sub);
    }
    deactivate(id, user) {
        return this.affiliateService.setEmployeeStatus(id, client_1.AffiliateStatusEnum.INACTIVE, user?.sub);
    }
    deleteEmployee(id, user) {
        return this.affiliateService.deleteEmployee(id, user?.sub);
    }
    // ── Sales & commissions ───────────────────────────────────────────────────
    listSales(query) {
        return this.affiliateService.listSales(query);
    }
    listCommissions(query) {
        return this.affiliateService.listCommissions(query);
    }
    // ── Withdrawals ───────────────────────────────────────────────────────────
    listWithdrawals(query) {
        return this.withdrawalService.list(query);
    }
    getWithdrawal(id) {
        return this.withdrawalService.findOne(id);
    }
    approve(id, user) {
        return this.withdrawalService.approve(id, user?.sub);
    }
    process(id, user) {
        return this.withdrawalService.process(id, user?.sub);
    }
    retry(id, user) {
        return this.withdrawalService.retry(id, user?.sub);
    }
    cancel(id, dto, user) {
        return this.withdrawalService.cancel(id, dto?.reason ?? 'Cancelled by admin', user?.sub);
    }
    // ── Settings & operations ─────────────────────────────────────────────────
    getSettings() {
        return this.settingsService.get();
    }
    updateSettings(dto, user) {
        return this.settingsService.update(dto, user?.sub);
    }
    runSweep() {
        return this.sweepService.run();
    }
    overview() {
        return this.affiliateService.getOverview();
    }
};
exports.AdminAffiliateController = AdminAffiliateController;
__decorate([
    (0, common_1.Get)('employees'),
    (0, swagger_1.ApiOperation)({ summary: 'List sales employees' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_list_query_dto_1.AdminAffiliateListQueryDto]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "listEmployees", null);
__decorate([
    (0, common_1.Get)('employees/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a sales employee' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "getEmployee", null);
__decorate([
    (0, common_1.Post)('employees'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a sales employee',
        description: 'Accepts either an existing userId, or email/firstName/lastName/password to create the user inline. ' +
            'Generates a unique EMP-XXXXX code and provisions the wallet in one transaction.',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_list_query_dto_1.CreateAffiliateEmployeeDto, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Patch)('employees/:id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a sales employee' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)('employees/:id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a sales employee (stops new commission accrual)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)('employees/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Soft-delete a sales employee',
        description: 'Refuses to delete while the wallet has an outstanding balance or a withdrawal is in flight — settle those first.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "deleteEmployee", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'List affiliate-attributed sales' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_list_query_dto_1.AdminSalesListQueryDto]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "listSales", null);
__decorate([
    (0, common_1.Get)('commissions'),
    (0, swagger_1.ApiOperation)({ summary: 'List commissions' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_list_query_dto_1.AdminCommissionListQueryDto]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "listCommissions", null);
__decorate([
    (0, common_1.Get)('withdrawals'),
    (0, swagger_1.ApiOperation)({ summary: 'List withdrawal requests' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_list_query_dto_1.AdminWithdrawalListQueryDto]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "listWithdrawals", null);
__decorate([
    (0, common_1.Get)('withdrawals/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a withdrawal request' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "getWithdrawal", null);
__decorate([
    (0, common_1.Post)('withdrawals/:id/approve'),
    (0, permissions_decorator_1.Permissions)('affiliate.manage', 'affiliate.payouts.process'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a pending withdrawal (schedules it for payout)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)('withdrawals/:id/process'),
    (0, permissions_decorator_1.Permissions)('affiliate.manage', 'affiliate.payouts.process'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate the RazorpayX payout for a withdrawal' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "process", null);
__decorate([
    (0, common_1.Post)('withdrawals/:id/retry'),
    (0, permissions_decorator_1.Permissions)('affiliate.manage', 'affiliate.payouts.process'),
    (0, swagger_1.ApiOperation)({ summary: 'Retry a failed withdrawal (re-reserves funds and re-initiates the payout)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "retry", null);
__decorate([
    (0, common_1.Post)('withdrawals/:id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a withdrawal and release the held funds' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_withdrawal_dto_1.WithdrawalActionDto, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get affiliate program settings' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update affiliate program settings' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_affiliate_settings_dto_1.UpdateAffiliateSettingsDto, Object]),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)('settings/run-sweep'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Manually run the commission eligibility / auto-payout sweep',
        description: 'Runs the same idempotent job the BullMQ repeatable job runs. Exposed so the sweep is operable without Redis.',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "runSweep", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Affiliate program dashboard stat cards' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminAffiliateController.prototype, "overview", null);
exports.AdminAffiliateController = AdminAffiliateController = __decorate([
    (0, swagger_1.ApiTags)('Admin — Affiliate'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('admin/affiliate'),
    (0, permissions_decorator_1.Permissions)('affiliate.manage'),
    __metadata("design:paramtypes", [affiliate_service_1.AffiliateService,
        withdrawal_service_1.WithdrawalService,
        affiliate_settings_service_1.AffiliateSettingsService,
        commission_sweep_service_1.CommissionSweepService])
], AdminAffiliateController);
//# sourceMappingURL=admin-affiliate.controller.js.map
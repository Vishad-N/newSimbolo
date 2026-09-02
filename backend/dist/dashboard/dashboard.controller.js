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
exports.DashboardController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_constant_1 = require("../common/constants/role.constant");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getAdminOverview() {
        return this.dashboardService.getAdminOverview();
    }
    async getAdminRevenueOverview() {
        return this.dashboardService.getAdminRevenueOverview();
    }
    async getAdminPaymentAnalytics(startDate, endDate) {
        return this.dashboardService.getAdminPaymentAnalytics(startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async getAdminPendingInvoices(page = 1, limit = 20) {
        return this.dashboardService.getAdminPendingInvoices(+page, +limit);
    }
    async getAdminWidgets() {
        return this.dashboardService.getAdminWidgets();
    }
    async getDashboardKpis() {
        return this.dashboardService.getDashboardKpis();
    }
    async getClientDashboard(clientId, user) {
        await this.dashboardService.assertClientAccess(clientId, user);
        return this.dashboardService.getClientDashboard(clientId);
    }
    async getClientBillingDashboard(clientId, user) {
        await this.dashboardService.assertClientAccess(clientId, user);
        return this.dashboardService.getClientBillingDashboard(clientId);
    }
    async getClientWidgets(clientId, user) {
        await this.dashboardService.assertClientAccess(clientId, user);
        return this.dashboardService.getClientWidgets(clientId);
    }
    async getProjectStats(projectId) {
        return this.dashboardService.getProjectStats(projectId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('admin'),
    (0, permissions_decorator_1.Permissions)('dashboard.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin dashboard – agency-wide metrics, recent activity, project status breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin overview returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminOverview", null);
__decorate([
    (0, common_1.Get)('admin/revenue'),
    (0, roles_decorator_1.Roles)(role_constant_1.UserRole.ADMIN, role_constant_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin revenue overview – current month vs last month, all-time total' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminRevenueOverview", null);
__decorate([
    (0, common_1.Get)('admin/payment-analytics'),
    (0, roles_decorator_1.Roles)(role_constant_1.UserRole.ADMIN, role_constant_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin payment analytics – by status, provider, and daily revenue' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminPaymentAnalytics", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('admin/pending-invoices'),
    (0, roles_decorator_1.Roles)(role_constant_1.UserRole.ADMIN, role_constant_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin pending invoices list' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminPendingInvoices", null);
__decorate([
    (0, common_1.Get)('admin/widgets'),
    (0, permissions_decorator_1.Permissions)('dashboard.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin configurable dashboard widget data for Phase 9 BI dashboard' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminWidgets", null);
__decorate([
    (0, common_1.Get)('kpis'),
    (0, permissions_decorator_1.Permissions)('dashboard.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard KPI summary including AOV, CLV, project completion, and revenue' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardKpis", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, permissions_decorator_1.Permissions)('dashboard.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Client dashboard – active projects, pending deliverables, meetings, tickets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client dashboard returned' }),
    __param(0, (0, common_1.Param)('clientId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getClientDashboard", null);
__decorate([
    (0, common_1.Get)('client/:clientId/billing'),
    (0, permissions_decorator_1.Permissions)('dashboard.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Client billing dashboard – payments, invoices, subscriptions, notifications' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('clientId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getClientBillingDashboard", null);
__decorate([
    (0, common_1.Get)('client/:clientId/widgets'),
    (0, permissions_decorator_1.Permissions)('dashboard.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Client dashboard widget data for Phase 9 BI dashboard' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('clientId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getClientWidgets", null);
__decorate([
    (0, common_1.Get)('project/:projectId/stats'),
    (0, permissions_decorator_1.Permissions)('dashboard.view', 'projects.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Project statistics – task breakdown, deliverable status, milestone progress' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project stats returned' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProjectStats", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard & Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map
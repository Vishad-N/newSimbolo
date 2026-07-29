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
exports.AnalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const analytics_service_1 = require("./analytics.service");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getAdminAnalytics(query) {
        return this.analyticsService.getAdminAnalytics(query);
    }
    getClientAnalytics(clientId) {
        return this.analyticsService.getClientAnalytics(clientId);
    }
    getKpis(query) {
        return this.analyticsService.getKpis(query);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('admin'),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin analytics dashboard with revenue, project, client, service, and workload metrics' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getAdminAnalytics", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, permissions_decorator_1.Permissions)('analytics.view', 'clients.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Client analytics dashboard with project, billing, meeting, and activity insights' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('clientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getClientAnalytics", null);
__decorate([
    (0, common_1.Get)('kpis'),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Business KPI engine including growth, conversion, AOV, CLV, and utilization' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getKpis", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map
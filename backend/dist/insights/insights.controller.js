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
exports.InsightsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const insight_dto_1 = require("./dto/insight.dto");
const insights_service_1 = require("./insights.service");
let InsightsController = class InsightsController {
    insightsService;
    constructor(insightsService) {
        this.insightsService = insightsService;
    }
    generate() {
        return this.insightsService.generateInsights();
    }
    findAll(query) {
        return this.insightsService.findInsights(query);
    }
};
exports.InsightsController = InsightsController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate and store AI business insights from operational data' }),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InsightsController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'List stored business insights for dashboard display' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [insight_dto_1.InsightQueryDto]),
    __metadata("design:returntype", void 0)
], InsightsController.prototype, "findAll", null);
exports.InsightsController = InsightsController = __decorate([
    (0, swagger_1.ApiTags)('Insights'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('insights'),
    __metadata("design:paramtypes", [insights_service_1.InsightsService])
], InsightsController);
//# sourceMappingURL=insights.controller.js.map
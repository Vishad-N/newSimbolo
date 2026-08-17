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
exports.ServicePageConfigController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const service_page_config_service_1 = require("./service-page-config.service");
const service_page_config_dto_1 = require("./dto/service-page-config.dto");
let ServicePageConfigController = class ServicePageConfigController {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async getConfig(slug) {
        return this.configService.findByServiceSlug(slug);
    }
    async updateConfig(slug, dto) {
        return this.configService.upsert(slug, dto);
    }
};
exports.ServicePageConfigController = ServicePageConfigController;
__decorate([
    (0, common_1.Get)(':slug'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicePageConfigController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Put)(':slug'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_page_config_dto_1.ServicePageConfigDto]),
    __metadata("design:returntype", Promise)
], ServicePageConfigController.prototype, "updateConfig", null);
exports.ServicePageConfigController = ServicePageConfigController = __decorate([
    (0, common_1.Controller)('service-page-config'),
    __metadata("design:paramtypes", [service_page_config_service_1.ServicePageConfigService])
], ServicePageConfigController);
//# sourceMappingURL=service-page-config.controller.js.map
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
exports.SettingsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
const update_theme_dto_1 = require("./dto/update-theme.dto");
const update_setting_dto_1 = require("./dto/update-setting.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getTheme() {
        return this.settingsService.getTheme();
    }
    async updateTheme(dto, user) {
        return this.settingsService.updateTheme(dto, user?.sub);
    }
    async getPublicSettings(category) {
        return this.settingsService.getGlobalSettings(category, true);
    }
    async getGlobalSettings(category) {
        return this.settingsService.getGlobalSettings(category, false);
    }
    async getSettingByKey(key) {
        return this.settingsService.getSettingByKey(key);
    }
    async upsertSetting(dto, user) {
        return this.settingsService.upsertSetting(dto, user?.sub);
    }
    async deleteSetting(key) {
        return this.settingsService.deleteSetting(key);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('theme'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current visual branding and theme settings (publicly accessible)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Theme returned successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getTheme", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('theme'),
    (0, permissions_decorator_1.Permissions)('settings.manage', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update brand colors, typography, and logos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Theme updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_theme_dto_1.UpdateThemeDto, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateTheme", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all publicly accessible runtime global settings (maintenance mode, socials, etc.)' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by category (e.g. SOCIALS, GENERAL)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public settings returned' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getPublicSettings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('global'),
    (0, permissions_decorator_1.Permissions)('settings.read', 'content.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all global settings (admin access required)' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All settings returned' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getGlobalSettings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('global/:key'),
    (0, permissions_decorator_1.Permissions)('settings.read', 'content.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single setting value by unique key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting returned' }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getSettingByKey", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('global'),
    (0, permissions_decorator_1.Permissions)('settings.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update (upsert) a global configuration setting' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Setting upserted successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_setting_dto_1.UpdateSettingDto, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "upsertSetting", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('global/:key'),
    (0, permissions_decorator_1.Permissions)('settings.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a global setting by key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting deleted successfully' }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "deleteSetting", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('Global Settings & Theming'),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map
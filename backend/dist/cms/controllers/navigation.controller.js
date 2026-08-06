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
exports.NavigationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cms_service_1 = require("../cms.service");
const update_page_section_dto_1 = require("../dto/update-page-section.dto");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let NavigationController = class NavigationController {
    cmsService;
    category = 'NAVIGATION';
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async getNavigation() {
        return this.cmsService.getPageSections(this.category);
    }
    async getSection(sectionKey) {
        return this.cmsService.getSection(this.category, sectionKey);
    }
    async updateMultiple(sections, user) {
        return this.cmsService.updateMultipleSections(this.category, sections, user?.sub);
    }
    async updateSection(dto, user) {
        return this.cmsService.updateSection(this.category, dto, user?.sub);
    }
    async deleteSection(sectionKey) {
        return this.cmsService.deleteSection(this.category, sectionKey);
    }
};
exports.NavigationController = NavigationController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all configured navigation menus (header, sidebar, footer links)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Navigation menus returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getNavigation", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':sectionKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific navigation menu by key (e.g. header_nav, sidebar_nav)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu data returned' }),
    __param(0, (0, common_1.Param)('sectionKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getSection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(),
    (0, permissions_decorator_1.Permissions)('content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update multiple navigation menus at once' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Navigation menus updated' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "updateMultiple", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('content.create', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update a specific navigation menu' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Menu updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_page_section_dto_1.UpdatePageSectionDto, Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "updateSection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':sectionKey'),
    (0, permissions_decorator_1.Permissions)('content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a navigation menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu deleted' }),
    __param(0, (0, common_1.Param)('sectionKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "deleteSection", null);
exports.NavigationController = NavigationController = __decorate([
    (0, swagger_1.ApiTags)('CMS - Navigation Manager'),
    (0, common_1.Controller)('cms/navigation'),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], NavigationController);
//# sourceMappingURL=navigation.controller.js.map
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
exports.FooterController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cms_service_1 = require("../cms.service");
const update_page_section_dto_1 = require("../dto/update-page-section.dto");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let FooterController = class FooterController {
    cmsService;
    category = 'FOOTER';
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async getFooter() {
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
exports.FooterController = FooterController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get configured footer data (quick links, social links, copyright, newsletter text)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Footer data returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FooterController.prototype, "getFooter", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':sectionKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific footer section by key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Section data returned' }),
    __param(0, (0, common_1.Param)('sectionKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FooterController.prototype, "getSection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(),
    (0, permissions_decorator_1.Permissions)('content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update multiple footer sections at once' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Footer sections updated' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FooterController.prototype, "updateMultiple", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('content.create', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update a specific footer section' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Section updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_page_section_dto_1.UpdatePageSectionDto, Object]),
    __metadata("design:returntype", Promise)
], FooterController.prototype, "updateSection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':sectionKey'),
    (0, permissions_decorator_1.Permissions)('content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a footer section' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Section deleted' }),
    __param(0, (0, common_1.Param)('sectionKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FooterController.prototype, "deleteSection", null);
exports.FooterController = FooterController = __decorate([
    (0, swagger_1.ApiTags)('CMS - Footer Manager'),
    (0, common_1.Controller)('cms/footer'),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], FooterController);
//# sourceMappingURL=footer.controller.js.map
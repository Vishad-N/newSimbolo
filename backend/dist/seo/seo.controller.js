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
exports.SeoController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const seo_service_1 = require("./seo.service");
const create_seo_page_dto_1 = require("./dto/create-seo-page.dto");
const update_seo_page_dto_1 = require("./dto/update-seo-page.dto");
const create_redirect_dto_1 = require("./dto/create-redirect.dto");
const create_sitemap_entry_dto_1 = require("./dto/create-sitemap-entry.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let SeoController = class SeoController {
    seoService;
    constructor(seoService) {
        this.seoService = seoService;
    }
    async getSitemapXml(baseUrl) {
        return this.seoService.generateXmlSitemap(baseUrl);
    }
    async getRedirects(isActive) {
        const act = isActive !== undefined ? isActive === 'true' : undefined;
        return this.seoService.getRedirects(act);
    }
    async getSitemapEntries(isActive) {
        const act = isActive !== undefined ? isActive === 'true' : undefined;
        return this.seoService.getSitemapEntries(act);
    }
    async getSeoByPath(path) {
        return this.seoService.getSeoByPath(path);
    }
    async getAllSeoPages() {
        return this.seoService.getAllSeoPages();
    }
    async createSeoPage(dto, user) {
        return this.seoService.createSeoPage(dto, user?.sub);
    }
    async updateSeoPage(id, dto, user) {
        return this.seoService.updateSeoPage(id, dto, user?.sub);
    }
    async deleteSeoPage(id) {
        return this.seoService.deleteSeoPage(id);
    }
    // Redirects CRUD
    async createRedirect(dto) {
        return this.seoService.createRedirect(dto);
    }
    async deleteRedirect(id) {
        return this.seoService.deleteRedirect(id);
    }
    // Sitemap Entries CRUD
    async createSitemapEntry(dto) {
        return this.seoService.createSitemapEntry(dto);
    }
    async deleteSitemapEntry(id) {
        return this.seoService.deleteSitemapEntry(id);
    }
};
exports.SeoController = SeoController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('sitemap.xml'),
    (0, common_1.Header)('Content-Type', 'application/xml'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dynamic XML sitemap for Google crawlers (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'baseUrl', required: false, example: 'https://thesimbolo.com' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'XML sitemap string returned' }),
    __param(0, (0, common_1.Query)('baseUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getSitemapXml", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('redirects'),
    (0, swagger_1.ApiOperation)({ summary: 'Get 301/302 HTTP redirect mapping rules (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redirect rules returned' }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getRedirects", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('sitemap-entries'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sitemap config entries (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sitemap entries returned' }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getSitemapEntries", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('page'),
    (0, swagger_1.ApiOperation)({ summary: 'Get SEO metadata by URL path (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'path', required: true, example: '/services/seo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SEO page metadata returned' }),
    __param(0, (0, common_1.Query)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getSeoByPath", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all SEO pages metadata (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All SEO pages returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "getAllSeoPages", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('seo.create', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create SEO metadata for a path' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'SEO page created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_seo_page_dto_1.CreateSeoPageDto, Object]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "createSeoPage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('seo.update', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update SEO meta tags, OpenGraph cards, or JSON-LD schema' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SEO page updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_seo_page_dto_1.UpdateSeoPageDto, Object]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "updateSeoPage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('seo.delete', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete SEO metadata entry' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SEO page deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "deleteSeoPage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('redirects'),
    (0, permissions_decorator_1.Permissions)('seo.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create 301/302 redirect rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Redirect rule created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_redirect_dto_1.CreateRedirectDto]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "createRedirect", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('redirects/:id'),
    (0, permissions_decorator_1.Permissions)('seo.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete redirect rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Redirect rule deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "deleteRedirect", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('sitemap-entries'),
    (0, permissions_decorator_1.Permissions)('seo.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create XML sitemap entry' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sitemap entry created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sitemap_entry_dto_1.CreateSitemapEntryDto]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "createSitemapEntry", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('sitemap-entries/:id'),
    (0, permissions_decorator_1.Permissions)('seo.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete XML sitemap entry' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sitemap entry deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "deleteSitemapEntry", null);
exports.SeoController = SeoController = __decorate([
    (0, swagger_1.ApiTags)('SEO Metadata, Redirects & XML Sitemaps'),
    (0, common_1.Controller)('seo'),
    __metadata("design:paramtypes", [seo_service_1.SeoService])
], SeoController);
//# sourceMappingURL=seo.controller.js.map
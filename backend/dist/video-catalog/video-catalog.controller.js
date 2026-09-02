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
exports.VideoCatalogController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const video_catalog_service_1 = require("./video-catalog.service");
const create_video_catalog_item_dto_1 = require("./dto/create-video-catalog-item.dto");
const update_video_catalog_item_dto_1 = require("./dto/update-video-catalog-item.dto");
const create_video_catalog_category_dto_1 = require("./dto/create-video-catalog-category.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let VideoCatalogController = class VideoCatalogController {
    videoCatalogService;
    constructor(videoCatalogService) {
        this.videoCatalogService = videoCatalogService;
    }
    async getCategories() {
        return this.videoCatalogService.getCategories();
    }
    async getItems(categoryId, search, status) {
        return this.videoCatalogService.getItems(categoryId, search, status);
    }
    async getAllItemsForAdmin() {
        return this.videoCatalogService.getItems(undefined, undefined, 'ALL');
    }
    async getItemBySlug(slug) {
        return this.videoCatalogService.getItemBySlug(slug);
    }
    async createItem(dto, user) {
        return this.videoCatalogService.createItem(dto, user?.sub);
    }
    async reorderItems(orderedIds) {
        return this.videoCatalogService.reorderItems(orderedIds);
    }
    async updateItem(id, dto, user) {
        return this.videoCatalogService.updateItem(id, dto, user?.sub);
    }
    async deleteItem(id, user) {
        return this.videoCatalogService.deleteItem(id, user?.sub);
    }
    // Categories CRUD
    async createCategory(dto) {
        return this.videoCatalogService.createCategory(dto);
    }
    async deleteCategory(id) {
        return this.videoCatalogService.deleteCategory(id);
    }
};
exports.VideoCatalogController = VideoCatalogController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all video catalog categories (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get video catalog items (public defaults to PUBLISHED)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.VideoCatalogStatusEnum, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Items returned' }),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "getItems", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('admin/all'),
    (0, permissions_decorator_1.Permissions)('video-catalog.manage', 'content.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get every video catalog item regardless of status (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Items returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "getAllItemsForAdmin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single video catalog item by slug (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item returned' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "getItemBySlug", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('video-catalog.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new video editing service card' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_video_catalog_item_dto_1.CreateVideoCatalogItemDto, Object]),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "createItem", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('reorder'),
    (0, permissions_decorator_1.Permissions)('video-catalog.manage', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder video catalog items by ID sequence' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Items reordered' }),
    __param(0, (0, common_1.Body)('orderedIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "reorderItems", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('video-catalog.manage', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a video editing service card' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_video_catalog_item_dto_1.UpdateVideoCatalogItemDto, Object]),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "updateItem", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('video-catalog.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete a video editing service card' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "deleteItem", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('categories'),
    (0, permissions_decorator_1.Permissions)('video-catalog.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a video catalog category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_video_catalog_category_dto_1.CreateVideoCatalogCategoryDto]),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('categories/:id'),
    (0, permissions_decorator_1.Permissions)('video-catalog.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a video catalog category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoCatalogController.prototype, "deleteCategory", null);
exports.VideoCatalogController = VideoCatalogController = __decorate([
    (0, swagger_1.ApiTags)('Video Editing Service Catalog'),
    (0, common_1.Controller)('video-catalog'),
    __metadata("design:paramtypes", [video_catalog_service_1.VideoCatalogService])
], VideoCatalogController);
//# sourceMappingURL=video-catalog.controller.js.map
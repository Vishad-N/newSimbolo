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
exports.ServicesCatalogController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const services_catalog_service_1 = require("./services-catalog.service");
const create_service_dto_1 = require("./dto/create-service.dto");
const update_service_dto_1 = require("./dto/update-service.dto");
const create_service_category_dto_1 = require("./dto/create-service-category.dto");
const create_service_feature_dto_1 = require("./dto/create-service-feature.dto");
const create_service_faq_dto_1 = require("./dto/create-service-faq.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let ServicesCatalogController = class ServicesCatalogController {
    servicesCatalogService;
    constructor(servicesCatalogService) {
        this.servicesCatalogService = servicesCatalogService;
    }
    async getCategories() {
        return this.servicesCatalogService.getCategories();
    }
    async getServices(categoryId, search) {
        return this.servicesCatalogService.getServices(categoryId, search);
    }
    async getServiceBySlug(slug) {
        return this.servicesCatalogService.getServiceBySlug(slug);
    }
    async createService(dto, user) {
        return this.servicesCatalogService.createService(dto, user?.sub);
    }
    async updateService(id, dto, user) {
        return this.servicesCatalogService.updateService(id, dto, user?.sub);
    }
    async deleteService(id, user) {
        return this.servicesCatalogService.deleteService(id, user?.sub);
    }
    // Categories CRUD
    async createCategory(dto, user) {
        return this.servicesCatalogService.createCategory(dto, user?.sub);
    }
    async deleteCategory(id) {
        return this.servicesCatalogService.deleteCategory(id);
    }
    // Features CRUD
    async addFeature(dto) {
        return this.servicesCatalogService.addFeature(dto);
    }
    async deleteFeature(id) {
        return this.servicesCatalogService.deleteFeature(id);
    }
    // FAQs CRUD
    async addFaq(dto) {
        return this.servicesCatalogService.addFaq(dto);
    }
    async deleteFaq(id) {
        return this.servicesCatalogService.deleteFaq(id);
    }
};
exports.ServicesCatalogController = ServicesCatalogController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all service categories (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories returned successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all marketing services with optional category and keyword search (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Services list returned' }),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "getServices", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed service by slug including features, FAQs, and packages (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service details returned' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "getServiceBySlug", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new marketing service offering' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Service created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_dto_1.CreateServiceDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "createService", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing service offering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_dto_1.UpdateServiceDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "updateService", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete a marketing service offering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "deleteService", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('categories'),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a service category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_category_dto_1.CreateServiceCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('categories/:id'),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a service category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "deleteCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('features'),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a feature to a service' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feature created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_feature_dto_1.CreateServiceFeatureDto]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "addFeature", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('features/:id'),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a feature from a service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feature removed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "deleteFeature", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('faqs'),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Add an FAQ to a service' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FAQ created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_faq_dto_1.CreateServiceFaqDto]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "addFaq", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('faqs/:id'),
    (0, permissions_decorator_1.Permissions)('services.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an FAQ from a service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQ removed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesCatalogController.prototype, "deleteFaq", null);
exports.ServicesCatalogController = ServicesCatalogController = __decorate([
    (0, swagger_1.ApiTags)('Marketing Services Catalog'),
    (0, common_1.Controller)('services'),
    __metadata("design:paramtypes", [services_catalog_service_1.ServicesCatalogService])
], ServicesCatalogController);
//# sourceMappingURL=services-catalog.controller.js.map
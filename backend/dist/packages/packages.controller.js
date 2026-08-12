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
exports.PackagesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const packages_service_1 = require("./packages.service");
const create_package_dto_1 = require("./dto/create-package.dto");
const update_package_dto_1 = require("./dto/update-package.dto");
const create_package_feature_dto_1 = require("./dto/create-package-feature.dto");
const package_pricing_dto_1 = require("./dto/package-pricing.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PackagesController = class PackagesController {
    packagesService;
    constructor(packagesService) {
        this.packagesService = packagesService;
    }
    async getPackages(serviceId, type) {
        return this.packagesService.getPackages(serviceId, type);
    }
    async getPackageBySlug(slug) {
        return this.packagesService.getPackageBySlug(slug);
    }
    async createPackage(dto, user) {
        return this.packagesService.createPackage(dto, user?.sub);
    }
    async updatePackage(id, dto, user) {
        return this.packagesService.updatePackage(id, dto, user?.sub);
    }
    async deletePackage(id, user) {
        return this.packagesService.deletePackage(id, user?.sub);
    }
    // Features CRUD
    async addFeature(dto) {
        return this.packagesService.addFeature(dto);
    }
    async deleteFeature(id) {
        return this.packagesService.deleteFeature(id);
    }
    // Pricings CRUD
    async upsertPricing(dto) {
        return this.packagesService.upsertPricing(dto);
    }
    async deletePricing(id) {
        return this.packagesService.deletePricing(id);
    }
};
exports.PackagesController = PackagesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all service pricing packages (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'serviceId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', enum: client_1.PackageTypeEnum, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Packages list returned' }),
    __param(0, (0, common_1.Query)('serviceId')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "getPackages", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single package details by slug (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Package returned' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "getPackageBySlug", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('packages.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new pricing tier package' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Package created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_package_dto_1.CreatePackageDto, Object]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "createPackage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('packages.manage', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing pricing tier package' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Package updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_package_dto_1.UpdatePackageDto, Object]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "updatePackage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('packages.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete a pricing tier package' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Package deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "deletePackage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('features'),
    (0, permissions_decorator_1.Permissions)('packages.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a deliverable feature item to a package' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feature added' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_package_feature_dto_1.CreatePackageFeatureDto]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "addFeature", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('features/:id'),
    (0, permissions_decorator_1.Permissions)('packages.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a deliverable feature item from a package' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feature removed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "deleteFeature", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('pricings'),
    (0, permissions_decorator_1.Permissions)('packages.manage', 'content.create', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Upsert currency-specific pricing schedule for a package' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pricing upserted' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [package_pricing_dto_1.PackagePricingDto]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "upsertPricing", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('pricings/:id'),
    (0, permissions_decorator_1.Permissions)('packages.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a currency-specific pricing schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pricing deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PackagesController.prototype, "deletePricing", null);
exports.PackagesController = PackagesController = __decorate([
    (0, swagger_1.ApiTags)('Service Pricing Packages & Retainers'),
    (0, common_1.Controller)('packages'),
    __metadata("design:paramtypes", [packages_service_1.PackagesService])
], PackagesController);
//# sourceMappingURL=packages.controller.js.map
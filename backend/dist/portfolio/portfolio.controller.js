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
exports.PortfolioController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const portfolio_service_1 = require("./portfolio.service");
const create_portfolio_project_dto_1 = require("./dto/create-portfolio-project.dto");
const update_portfolio_project_dto_1 = require("./dto/update-portfolio-project.dto");
const create_portfolio_category_dto_1 = require("./dto/create-portfolio-category.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PortfolioController = class PortfolioController {
    portfolioService;
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    async getCategories() {
        return this.portfolioService.getCategories();
    }
    async getProjects(categoryId, serviceId, isFeatured, search, status) {
        const feat = isFeatured !== undefined ? isFeatured === 'true' : undefined;
        return this.portfolioService.getProjects(categoryId, serviceId, feat, search, status);
    }
    async getProjectBySlug(slug) {
        return this.portfolioService.getProjectBySlug(slug);
    }
    async createProject(dto, user) {
        return this.portfolioService.createProject(dto, user?.sub);
    }
    async updateProject(id, dto, user) {
        return this.portfolioService.updateProject(id, dto, user?.sub);
    }
    async deleteProject(id, user) {
        return this.portfolioService.deleteProject(id, user?.sub);
    }
    // Categories CRUD
    async createCategory(dto) {
        return this.portfolioService.createCategory(dto);
    }
    async deleteCategory(id) {
        return this.portfolioService.deleteCategory(id);
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all portfolio taxonomy categories (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get portfolio projects list (public defaults to PUBLISHED)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'serviceId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'isFeatured', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.PortfolioStatusEnum, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Projects returned' }),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('serviceId')),
    __param(2, (0, common_1.Query)('isFeatured')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "getProjects", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single portfolio project by slug (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project returned' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "getProjectBySlug", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('portfolio.create', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new creative showcase project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Project created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_portfolio_project_dto_1.CreatePortfolioProjectDto, Object]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "createProject", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('portfolio.update', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a portfolio project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_portfolio_project_dto_1.UpdatePortfolioProjectDto, Object]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "updateProject", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('portfolio.delete', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete a portfolio project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "deleteProject", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('categories'),
    (0, permissions_decorator_1.Permissions)('portfolio.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create portfolio category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_portfolio_category_dto_1.CreatePortfolioCategoryDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('categories/:id'),
    (0, permissions_decorator_1.Permissions)('portfolio.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete portfolio category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "deleteCategory", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, swagger_1.ApiTags)('Creative Portfolio & Project Showcase'),
    (0, common_1.Controller)('portfolio'),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService])
], PortfolioController);
//# sourceMappingURL=portfolio.controller.js.map
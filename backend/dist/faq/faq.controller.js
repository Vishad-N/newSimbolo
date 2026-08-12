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
exports.FaqController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const faq_service_1 = require("./faq.service");
const create_faq_dto_1 = require("./dto/create-faq.dto");
const update_faq_dto_1 = require("./dto/update-faq.dto");
const create_faq_category_dto_1 = require("./dto/create-faq-category.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let FaqController = class FaqController {
    faqService;
    constructor(faqService) {
        this.faqService = faqService;
    }
    async getCategories() {
        return this.faqService.getCategories();
    }
    async getFaqs(categoryId, serviceId, isFeatured, search, status) {
        const feat = isFeatured !== undefined ? isFeatured === 'true' : undefined;
        return this.faqService.getFaqs(categoryId, serviceId, feat, search, status);
    }
    async getFaqById(id) {
        return this.faqService.getFaqById(id);
    }
    async createFaq(dto, user) {
        return this.faqService.createFaq(dto, user?.sub);
    }
    async updateFaq(id, dto, user) {
        return this.faqService.updateFaq(id, dto, user?.sub);
    }
    async deleteFaq(id, user) {
        return this.faqService.deleteFaq(id, user?.sub);
    }
    // Categories CRUD
    async createCategory(dto) {
        return this.faqService.createCategory(dto);
    }
    async deleteCategory(id) {
        return this.faqService.deleteCategory(id);
    }
};
exports.FaqController = FaqController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all FAQ taxonomy categories (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get FAQs list with optional category or keyword filtering (public)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'serviceId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'isFeatured', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.FAQStatusEnum, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQs list returned' }),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('serviceId')),
    __param(2, (0, common_1.Query)('isFeatured')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "getFaqs", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FAQ details by UUID (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQ returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "getFaqById", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('faqs.create', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new question and answer item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FAQ created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_faq_dto_1.CreateFaqDto, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "createFaq", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('faqs.update', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update FAQ question, answer, category, or order index' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQ updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_faq_dto_1.UpdateFaqDto, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "updateFaq", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('faqs.delete', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete an FAQ item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FAQ deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "deleteFaq", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('categories'),
    (0, permissions_decorator_1.Permissions)('faqs.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create FAQ category tab' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_faq_category_dto_1.CreateFaqCategoryDto]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('categories/:id'),
    (0, permissions_decorator_1.Permissions)('faqs.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete FAQ category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "deleteCategory", null);
exports.FaqController = FaqController = __decorate([
    (0, swagger_1.ApiTags)('Frequently Asked Questions (FAQ)'),
    (0, common_1.Controller)('faqs'),
    __metadata("design:paramtypes", [faq_service_1.FaqService])
], FaqController);
//# sourceMappingURL=faq.controller.js.map
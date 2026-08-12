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
exports.CaseStudiesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const case_studies_service_1 = require("./case-studies.service");
const create_case_study_dto_1 = require("./dto/create-case-study.dto");
const update_case_study_dto_1 = require("./dto/update-case-study.dto");
const create_case_study_category_dto_1 = require("./dto/create-case-study-category.dto");
const create_case_study_metric_dto_1 = require("./dto/create-case-study-metric.dto");
const create_before_after_dto_1 = require("./dto/create-before-after.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let CaseStudiesController = class CaseStudiesController {
    caseStudiesService;
    constructor(caseStudiesService) {
        this.caseStudiesService = caseStudiesService;
    }
    async getCategories() {
        return this.caseStudiesService.getCategories();
    }
    async getCaseStudies(categoryId, serviceId, search, status) {
        return this.caseStudiesService.getCaseStudies(categoryId, serviceId, search, status);
    }
    async getCaseStudyBySlug(slug) {
        return this.caseStudiesService.getCaseStudyBySlug(slug);
    }
    async createCaseStudy(dto, user) {
        return this.caseStudiesService.createCaseStudy(dto, user?.sub);
    }
    async updateCaseStudy(id, dto, user) {
        return this.caseStudiesService.updateCaseStudy(id, dto, user?.sub);
    }
    async deleteCaseStudy(id, user) {
        return this.caseStudiesService.deleteCaseStudy(id, user?.sub);
    }
    // Categories CRUD
    async createCategory(dto) {
        return this.caseStudiesService.createCategory(dto);
    }
    async deleteCategory(id) {
        return this.caseStudiesService.deleteCategory(id);
    }
    // Metrics CRUD
    async addMetric(dto) {
        return this.caseStudiesService.addMetric(dto);
    }
    async deleteMetric(id) {
        return this.caseStudiesService.deleteMetric(id);
    }
    // Before/After CRUD
    async addBeforeAfter(dto) {
        return this.caseStudiesService.addBeforeAfter(dto);
    }
    async deleteBeforeAfter(id) {
        return this.caseStudiesService.deleteBeforeAfter(id);
    }
};
exports.CaseStudiesController = CaseStudiesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all case study industry categories (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get case studies list (public defaults to PUBLISHED)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'serviceId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.CaseStudyStatusEnum, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Case studies returned' }),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('serviceId')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "getCaseStudies", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed case study by slug including KPIs and before/after sliders (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Case study details returned' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "getCaseStudyBySlug", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('casestudies.create', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new case study' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Case study created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_case_study_dto_1.CreateCaseStudyDto, Object]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "createCaseStudy", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('casestudies.update', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update case study content, challenge, solution, or status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Case study updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_case_study_dto_1.UpdateCaseStudyDto, Object]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "updateCaseStudy", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('casestudies.delete', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete a case study' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Case study deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "deleteCaseStudy", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('categories'),
    (0, permissions_decorator_1.Permissions)('casestudies.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create case study category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_case_study_category_dto_1.CreateCaseStudyCategoryDto]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('categories/:id'),
    (0, permissions_decorator_1.Permissions)('casestudies.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete case study category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "deleteCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('metrics'),
    (0, permissions_decorator_1.Permissions)('casestudies.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a measurable KPI metric to a case study' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Metric added' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_case_study_metric_dto_1.CreateCaseStudyMetricDto]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "addMetric", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('metrics/:id'),
    (0, permissions_decorator_1.Permissions)('casestudies.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a KPI metric' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metric removed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "deleteMetric", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('before-after'),
    (0, permissions_decorator_1.Permissions)('casestudies.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Add visual before/after comparison slider images' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comparison slider added' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_before_after_dto_1.CreateBeforeAfterDto]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "addBeforeAfter", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('before-after/:id'),
    (0, permissions_decorator_1.Permissions)('casestudies.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove before/after comparison slider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Slider removed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CaseStudiesController.prototype, "deleteBeforeAfter", null);
exports.CaseStudiesController = CaseStudiesController = __decorate([
    (0, swagger_1.ApiTags)('Client Case Studies & Success Stories'),
    (0, common_1.Controller)('case-studies'),
    __metadata("design:paramtypes", [case_studies_service_1.CaseStudiesService])
], CaseStudiesController);
//# sourceMappingURL=case-studies.controller.js.map
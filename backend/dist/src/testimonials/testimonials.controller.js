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
exports.TestimonialsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const testimonials_service_1 = require("./testimonials.service");
const create_testimonial_dto_1 = require("./dto/create-testimonial.dto");
const update_testimonial_dto_1 = require("./dto/update-testimonial.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let TestimonialsController = class TestimonialsController {
    testimonialsService;
    constructor(testimonialsService) {
        this.testimonialsService = testimonialsService;
    }
    async getTestimonials(isFeatured, clientId, caseStudyId, status) {
        const feat = isFeatured !== undefined ? isFeatured === 'true' : undefined;
        return this.testimonialsService.getTestimonials(feat, clientId, caseStudyId, status);
    }
    async getTestimonialById(id) {
        return this.testimonialsService.getTestimonialById(id);
    }
    async createTestimonial(dto, user) {
        return this.testimonialsService.createTestimonial(dto, user?.sub);
    }
    async updateTestimonial(id, dto, user) {
        return this.testimonialsService.updateTestimonial(id, dto, user?.sub);
    }
    async deleteTestimonial(id, user) {
        return this.testimonialsService.deleteTestimonial(id, user?.sub);
    }
};
exports.TestimonialsController = TestimonialsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get client testimonials list (public defaults to APPROVED)' }),
    (0, swagger_1.ApiQuery)({ name: 'isFeatured', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'caseStudyId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.TestimonialStatusEnum, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Testimonials returned' }),
    __param(0, (0, common_1.Query)('isFeatured')),
    __param(1, (0, common_1.Query)('clientId')),
    __param(2, (0, common_1.Query)('caseStudyId')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TestimonialsController.prototype, "getTestimonials", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get testimonial by UUID (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Testimonial returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestimonialsController.prototype, "getTestimonialById", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('testimonials.create', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a client review or testimonial' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Testimonial created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_testimonial_dto_1.CreateTestimonialDto, Object]),
    __metadata("design:returntype", Promise)
], TestimonialsController.prototype, "createTestimonial", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('testimonials.update', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update testimonial quote, rating, or approval status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Testimonial updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_testimonial_dto_1.UpdateTestimonialDto, Object]),
    __metadata("design:returntype", Promise)
], TestimonialsController.prototype, "updateTestimonial", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('testimonials.delete', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete a testimonial' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Testimonial deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TestimonialsController.prototype, "deleteTestimonial", null);
exports.TestimonialsController = TestimonialsController = __decorate([
    (0, swagger_1.ApiTags)('Client Reviews & Social Proof Testimonials'),
    (0, common_1.Controller)('testimonials'),
    __metadata("design:paramtypes", [testimonials_service_1.TestimonialsService])
], TestimonialsController);
//# sourceMappingURL=testimonials.controller.js.map
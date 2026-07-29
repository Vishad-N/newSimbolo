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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCaseStudyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateCaseStudyDto {
    title;
    summary;
    challenge;
    solution;
    results;
    clientName;
    industry;
    status;
    serviceId;
    categoryId;
    coverImageId;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, summary: { required: true, type: () => String }, challenge: { required: true, type: () => String }, solution: { required: true, type: () => String }, results: { required: true, type: () => String }, clientName: { required: true, type: () => String }, industry: { required: false, type: () => String }, status: { required: false, enum: ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] }, serviceId: { required: false, type: () => String, nullable: true, format: "uuid" }, categoryId: { required: false, type: () => String, nullable: true, format: "uuid" }, coverImageId: { required: false, type: () => String, nullable: true, format: "uuid" } };
    }
}
exports.CreateCaseStudyDto = CreateCaseStudyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Scaling FinTech Organic Traffic by 400%', description: 'Case study title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCaseStudyDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'How we helped Acme FinTech dominate high-intent keywords...',
        description: 'Executive summary',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCaseStudyDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme was struggling with low search visibility...', description: 'The challenge' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCaseStudyDto.prototype, "challenge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'We deployed a full technical SEO audit and topic cluster strategy...',
        description: 'The solution implemented',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCaseStudyDto.prototype, "solution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Within 6 months, organic traffic grew by 400%...',
        description: 'The measurable results achieved',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCaseStudyDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme FinTech Corp', description: 'Client company name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCaseStudyDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'FinTech', description: 'Industry domain' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCaseStudyDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.CaseStudyStatusEnum, default: client_1.CaseStudyStatusEnum.DRAFT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CaseStudyStatusEnum),
    __metadata("design:type", String)
], CreateCaseStudyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreateCaseStudyDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'CaseStudyCategory UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreateCaseStudyDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Cover image MediaAsset UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreateCaseStudyDto.prototype, "coverImageId", void 0);
//# sourceMappingURL=create-case-study.dto.js.map
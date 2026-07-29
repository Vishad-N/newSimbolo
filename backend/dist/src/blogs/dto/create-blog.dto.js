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
exports.CreateBlogDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateBlogDto {
    title;
    excerpt;
    content;
    status;
    authorId;
    coverImageId;
    categoryId;
    tags;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, excerpt: { required: false, type: () => String }, content: { required: true, type: () => String }, status: { required: false, enum: ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] }, authorId: { required: true, type: () => String, format: "uuid" }, coverImageId: { required: false, type: () => String, nullable: true, format: "uuid" }, categoryId: { required: false, type: () => String, nullable: true, format: "uuid" }, tags: { required: false, type: () => [String] } };
    }
}
exports.CreateBlogDto = CreateBlogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10 AI Marketing Trends in 2026', description: 'Article title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Discover how artificial intelligence is transforming digital advertising...',
        description: 'Short summary excerpt',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '# AI Marketing in 2026\n\nFull markdown or html article body...',
        description: 'Full article body content',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.BlogStatusEnum, default: client_1.BlogStatusEnum.DRAFT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.BlogStatusEnum),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Author UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "authorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Cover image MediaAsset UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreateBlogDto.prototype, "coverImageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'BlogCategory UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreateBlogDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['AI', 'Marketing', 'SEO'], description: 'Array of tag names to attach or create' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBlogDto.prototype, "tags", void 0);
//# sourceMappingURL=create-blog.dto.js.map
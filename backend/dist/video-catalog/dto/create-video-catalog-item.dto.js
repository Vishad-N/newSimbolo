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
exports.CreateVideoCatalogItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateVideoCatalogItemDto {
    title;
    categoryIds;
    thumbnail;
    previewType;
    previewUrl;
    shortDescription;
    fullDescription;
    hourlyRate;
    currency;
    estimatedDelivery;
    recommendedDuration;
    complexity;
    tags;
    badge;
    status;
    featured;
    displayOrder;
    ctaText;
    ctaLink;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, categoryIds: { required: false, type: () => [String], format: "uuid" }, thumbnail: { required: true, type: () => String }, previewType: { required: false, enum: ["DIRECT", "YOUTUBE", "INSTAGRAM", "VIMEO"] }, previewUrl: { required: true, type: () => String }, shortDescription: { required: true, type: () => String }, fullDescription: { required: false, type: () => String }, hourlyRate: { required: false, type: () => Number, minimum: 0 }, currency: { required: false, type: () => String }, estimatedDelivery: { required: false, type: () => String }, recommendedDuration: { required: false, type: () => String }, complexity: { required: false, enum: ["LOW", "MEDIUM", "HIGH", "EXPERT"] }, tags: { required: false, type: () => [String] }, badge: { required: false, type: () => String }, status: { required: false, enum: ["PUBLISHED", "ARCHIVED", "HIDDEN"] }, featured: { required: false, type: () => Boolean }, displayOrder: { required: false, type: () => Number }, ctaText: { required: false, type: () => String }, ctaLink: { required: false, type: () => String } };
    }
}
exports.CreateVideoCatalogItemDto = CreateVideoCatalogItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Instagram Reels & TikToks' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['cat-1', 'cat-2'], description: 'Category IDs this card should appear under' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CreateVideoCatalogItemDto.prototype, "categoryIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://res.cloudinary.com/.../thumbnail.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.VideoPreviewTypeEnum, default: client_1.VideoPreviewTypeEnum.YOUTUBE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VideoPreviewTypeEnum),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "previewType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://www.youtube.com/embed/xxxxxxxxxxx', description: 'Video link shown in the player' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "previewUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'High-retention short-form content with captions, sound effects, and fast-paced cuts.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "fullDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 600, description: 'Hourly rate shown on the card' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVideoCatalogItemDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '24-48 Hours' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '15-60 Seconds' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "recommendedDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.VideoCatalogComplexityEnum, default: client_1.VideoCatalogComplexityEnum.MEDIUM }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VideoCatalogComplexityEnum),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "complexity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Trending', 'Fast Delivery'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateVideoCatalogItemDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Popular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "badge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.VideoCatalogStatusEnum, default: client_1.VideoCatalogStatusEnum.PUBLISHED }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VideoCatalogStatusEnum),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVideoCatalogItemDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVideoCatalogItemDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Request Quote' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "ctaText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/contact?service=video-reels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVideoCatalogItemDto.prototype, "ctaLink", void 0);
//# sourceMappingURL=create-video-catalog-item.dto.js.map
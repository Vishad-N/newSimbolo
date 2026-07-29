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
exports.CreateSeoPageDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSeoPageDto {
    path;
    metaTitle;
    metaDescription;
    keywords;
    canonicalUrl;
    ogTitle;
    ogDescription;
    ogImageId;
    twitterCard;
    schemaJson;
    indexable;
    followable;
    static _OPENAPI_METADATA_FACTORY() {
        return { path: { required: true, type: () => String }, metaTitle: { required: true, type: () => String }, metaDescription: { required: true, type: () => String }, keywords: { required: false, type: () => String }, canonicalUrl: { required: false, type: () => String }, ogTitle: { required: false, type: () => String }, ogDescription: { required: false, type: () => String }, ogImageId: { required: false, type: () => String, nullable: true, format: "uuid" }, twitterCard: { required: false, type: () => String }, schemaJson: { required: false, type: () => String }, indexable: { required: false, type: () => Boolean }, followable: { required: false, type: () => Boolean } };
    }
}
exports.CreateSeoPageDto = CreateSeoPageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/services/seo', description: 'URL path mapping' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Search Engine Optimization Services | The Simbolo', description: 'Page title tag' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Boost organic traffic and achieve page 1 Google rankings with our AI-powered SEO solutions.',
        description: 'Meta description tag',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'seo, search engine optimization, digital marketing', description: 'Meta keywords' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://thesimbolo.com/services/seo', description: 'Canonical URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "canonicalUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Search Engine Optimization | The Simbolo', description: 'OpenGraph title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "ogTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Boost organic traffic with our AI SEO solutions.',
        description: 'OpenGraph description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "ogDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'c0a80123-4567-89ab-cdef-0123456789ab',
        description: 'OpenGraph Image MediaAsset UUID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreateSeoPageDto.prototype, "ogImageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'summary_large_image', default: 'summary_large_image' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "twitterCard", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '{"@context": "https://schema.org", "@type": "Service"}',
        description: 'Structured JSON-LD schema string',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSeoPageDto.prototype, "schemaJson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true, description: 'Whether robots should index this page' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSeoPageDto.prototype, "indexable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true, description: 'Whether robots should follow links on this page' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSeoPageDto.prototype, "followable", void 0);
//# sourceMappingURL=create-seo-page.dto.js.map
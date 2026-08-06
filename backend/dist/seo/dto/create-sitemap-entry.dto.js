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
exports.CreateSitemapEntryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSitemapEntryDto {
    loc;
    changefreq;
    priority;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { loc: { required: true, type: () => String }, changefreq: { required: false, type: () => String }, priority: { required: false, type: () => Number }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateSitemapEntryDto = CreateSitemapEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/services/seo', description: 'URL path loc' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSitemapEntryDto.prototype, "loc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'weekly',
        default: 'weekly',
        description: 'Change frequency (always, hourly, daily, weekly, monthly, yearly, never)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSitemapEntryDto.prototype, "changefreq", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.8, default: 0.8, description: 'Crawl priority from 0.0 to 1.0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSitemapEntryDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true, description: 'Whether active in XML sitemap generation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSitemapEntryDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-sitemap-entry.dto.js.map
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
exports.CreateServiceDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateServiceDto {
    name;
    shortDescription;
    fullDescription;
    iconUrl;
    type;
    basePrice;
    categoryId;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, shortDescription: { required: true, type: () => String }, fullDescription: { required: false, type: () => String }, iconUrl: { required: false, type: () => String }, type: { required: false, enum: ["CUSTOM", "RETAINER", "ONE_TIME", "HOURLY", "CONSULTING"] }, basePrice: { required: false, type: () => Number, minimum: 0 }, categoryId: { required: false, type: () => String, nullable: true, format: "uuid" } };
    }
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Search Engine Optimization (SEO)', description: 'Name of the service' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Boost organic traffic and rank on page 1 of Google.', description: 'Short summary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Full detailed breakdown of SEO methodology...', description: 'Full description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "fullDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/seo-icon.svg', description: 'Icon URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "iconUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ServiceTypeEnum, default: client_1.ServiceTypeEnum.RETAINER }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ServiceTypeEnum),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1500, description: 'Base starting price in USD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'ServiceCategory UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreateServiceDto.prototype, "categoryId", void 0);
//# sourceMappingURL=create-service.dto.js.map
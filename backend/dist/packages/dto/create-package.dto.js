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
exports.CreatePackageDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const package_illustrations_1 = require("../package-illustrations");
class CreatePackageDto {
    name;
    description;
    illustration;
    type;
    serviceId;
    basePrice;
    billingInterval;
    isPopular;
    isAddon;
    isCustom;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: false, type: () => String }, illustration: { required: false, type: () => String, nullable: true, enum: package_illustrations_1.PACKAGE_ILLUSTRATION_PATHS }, type: { required: false, enum: ["CUSTOM", "STARTER", "PROFESSIONAL", "ENTERPRISE"] }, serviceId: { required: true, type: () => String, format: "uuid" }, basePrice: { required: false, type: () => Number, minimum: 0 }, billingInterval: { required: false, type: () => String }, isPopular: { required: false, type: () => Boolean }, isAddon: { required: false, type: () => Boolean }, isCustom: { required: false, type: () => Boolean } };
    }
}
exports.CreatePackageDto = CreatePackageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Growth Pro', description: 'Name of the pricing package' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Ideal for scaling businesses needing daily marketing management.',
        description: 'Description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: package_illustrations_1.PACKAGE_ILLUSTRATION_PATHS,
        nullable: true,
        example: '/images/services/seo.png',
        description: 'Illustration bundled with the landing website',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(package_illustrations_1.PACKAGE_ILLUSTRATION_PATHS),
    __metadata("design:type", Object)
], CreatePackageDto.prototype, "illustration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PackageTypeEnum, default: client_1.PackageTypeEnum.STARTER }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PackageTypeEnum),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID this package belongs to' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2500, description: 'Base starting price' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePackageDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'monthly',
        default: 'monthly',
        description: 'Billing interval (monthly, yearly, one-time)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePackageDto.prototype, "billingInterval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: false, description: 'Whether to highlight as Most Popular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePackageDto.prototype, "isPopular", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false, description: 'Whether this is an Add-on package' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePackageDto.prototype, "isAddon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false, description: 'Whether this is a custom quote tier' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePackageDto.prototype, "isCustom", void 0);
//# sourceMappingURL=create-package.dto.js.map
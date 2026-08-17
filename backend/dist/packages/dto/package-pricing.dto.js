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
exports.PackagePricingDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PackagePricingDto {
    packageId;
    currency;
    price;
    billingPeriod;
    discountPercentage;
    static _OPENAPI_METADATA_FACTORY() {
        return { packageId: { required: true, type: () => String, format: "uuid" }, currency: { required: false, type: () => String }, price: { required: true, type: () => Number, minimum: 0 }, billingPeriod: { required: false, type: () => String }, discountPercentage: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.PackagePricingDto = PackagePricingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Package UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], PackagePricingDto.prototype, "packageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'USD', default: 'INR', description: 'Currency code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PackagePricingDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1999, description: 'Price in specified currency' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackagePricingDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'monthly', default: 'monthly', description: 'Billing period (monthly, yearly)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PackagePricingDto.prototype, "billingPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 15, default: 0.0, description: 'Promotional discount percentage' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PackagePricingDto.prototype, "discountPercentage", void 0);
//# sourceMappingURL=package-pricing.dto.js.map
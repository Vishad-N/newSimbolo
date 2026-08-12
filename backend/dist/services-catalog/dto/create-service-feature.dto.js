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
exports.CreateServiceFeatureDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateServiceFeatureDto {
    name;
    description;
    serviceId;
    isIncluded;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: false, type: () => String }, serviceId: { required: true, type: () => String, format: "uuid" }, isIncluded: { required: false, type: () => Boolean }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.CreateServiceFeatureDto = CreateServiceFeatureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Keyword Research & Competitor Mapping', description: 'Feature title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceFeatureDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'In-depth analysis of high-intent search queries', description: 'Description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateServiceFeatureDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Parent Service UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateServiceFeatureDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true, description: 'Whether feature is included' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateServiceFeatureDto.prototype, "isIncluded", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateServiceFeatureDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-service-feature.dto.js.map
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
exports.CreateBeforeAfterDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBeforeAfterDto {
    title;
    description;
    beforeImageId;
    afterImageId;
    caseStudyId;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, description: { required: false, type: () => String }, beforeImageId: { required: true, type: () => String, format: "uuid" }, afterImageId: { required: true, type: () => String, format: "uuid" }, caseStudyId: { required: true, type: () => String, format: "uuid" }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.CreateBeforeAfterDto = CreateBeforeAfterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Homepage Redesign Visual Transformation', description: 'Comparison title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeforeAfterDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Before: outdated layout vs After: high-converting design', description: 'Description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeforeAfterDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Before image MediaAsset UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateBeforeAfterDto.prototype, "beforeImageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'After image MediaAsset UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateBeforeAfterDto.prototype, "afterImageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'CaseStudy UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateBeforeAfterDto.prototype, "caseStudyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBeforeAfterDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-before-after.dto.js.map
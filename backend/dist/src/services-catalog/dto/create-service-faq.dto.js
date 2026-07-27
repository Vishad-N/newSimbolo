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
exports.CreateServiceFaqDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateServiceFaqDto {
    question;
    answer;
    serviceId;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { question: { required: true, type: () => String }, answer: { required: true, type: () => String }, serviceId: { required: true, type: () => String, format: "uuid" }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.CreateServiceFaqDto = CreateServiceFaqDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'How long does it take to see SEO results?', description: 'Question text' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceFaqDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Typically 3 to 6 months depending on competition.', description: 'Answer text' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceFaqDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Parent Service UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateServiceFaqDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateServiceFaqDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-service-faq.dto.js.map
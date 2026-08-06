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
exports.AiGenerationDto = exports.AiCapability = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AiCapability;
(function (AiCapability) {
    AiCapability["BLOG_DRAFT"] = "BLOG_DRAFT";
    AiCapability["IMPROVE_CONTENT"] = "IMPROVE_CONTENT";
    AiCapability["SEO_RECOMMENDATIONS"] = "SEO_RECOMMENDATIONS";
    AiCapability["META_TITLE"] = "META_TITLE";
    AiCapability["META_DESCRIPTION"] = "META_DESCRIPTION";
    AiCapability["FAQ_GENERATION"] = "FAQ_GENERATION";
    AiCapability["SERVICE_DESCRIPTION"] = "SERVICE_DESCRIPTION";
    AiCapability["MARKETING_COPY"] = "MARKETING_COPY";
    AiCapability["LANDING_PAGE_COPY"] = "LANDING_PAGE_COPY";
    AiCapability["EMAIL_DRAFT"] = "EMAIL_DRAFT";
})(AiCapability || (exports.AiCapability = AiCapability = {}));
class AiGenerationDto {
    capability;
    prompt;
    content;
    tone;
    static _OPENAPI_METADATA_FACTORY() {
        return { capability: { required: true, enum: require("./ai.dto").AiCapability }, prompt: { required: true, type: () => String, minLength: 3, maxLength: 4000 }, content: { required: false, type: () => String, maxLength: 12000 }, tone: { required: false, type: () => String } };
    }
}
exports.AiGenerationDto = AiGenerationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AiCapability }),
    (0, class_validator_1.IsEnum)(AiCapability),
    __metadata("design:type", String)
], AiGenerationDto.prototype, "capability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minLength: 3, maxLength: 4000 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], AiGenerationDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 12000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(12000),
    __metadata("design:type", String)
], AiGenerationDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'professional' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AiGenerationDto.prototype, "tone", void 0);
//# sourceMappingURL=ai.dto.js.map
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
exports.CreateRedirectDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRedirectDto {
    sourcePath;
    targetPath;
    statusCode;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { sourcePath: { required: true, type: () => String }, targetPath: { required: true, type: () => String }, statusCode: { required: false, type: () => Number }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateRedirectDto = CreateRedirectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/old-pricing-page', description: 'Legacy source path' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRedirectDto.prototype, "sourcePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/pricing', description: 'Target destination path' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRedirectDto.prototype, "targetPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 301, default: 301, description: 'HTTP redirect status code (301 or 302)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateRedirectDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true, description: 'Whether the rule is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRedirectDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-redirect.dto.js.map
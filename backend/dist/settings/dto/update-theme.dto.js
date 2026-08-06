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
exports.UpdateThemeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateThemeDto {
    primaryColor;
    secondaryColor;
    accentColor;
    darkModeLogoUrl;
    lightModeLogoUrl;
    fontFamily;
    static _OPENAPI_METADATA_FACTORY() {
        return { primaryColor: { required: false, type: () => String, pattern: "^#[0-9A-Fa-f]{6}$" }, secondaryColor: { required: false, type: () => String, pattern: "^#[0-9A-Fa-f]{6}$" }, accentColor: { required: false, type: () => String, pattern: "^#[0-9A-Fa-f]{6}$" }, darkModeLogoUrl: { required: false, type: () => String, nullable: true, maxLength: 500 }, lightModeLogoUrl: { required: false, type: () => String, nullable: true, maxLength: 500 }, fontFamily: { required: false, type: () => String, maxLength: 100 } };
    }
}
exports.UpdateThemeDto = UpdateThemeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#14B8A6', description: 'Primary brand hex color' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, { message: 'primaryColor must be a valid 6-character hex color code' }),
    __metadata("design:type", String)
], UpdateThemeDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#0F172A', description: 'Secondary brand hex color' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, { message: 'secondaryColor must be a valid 6-character hex color code' }),
    __metadata("design:type", String)
], UpdateThemeDto.prototype, "secondaryColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#F59E0B', description: 'Accent hex color' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, { message: 'accentColor must be a valid 6-character hex color code' }),
    __metadata("design:type", String)
], UpdateThemeDto.prototype, "accentColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/dark-logo.png', description: 'URL to dark mode logo image' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], UpdateThemeDto.prototype, "darkModeLogoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/light-logo.png', description: 'URL to light mode logo image' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], UpdateThemeDto.prototype, "lightModeLogoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Inter', description: 'Primary font family name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateThemeDto.prototype, "fontFamily", void 0);
//# sourceMappingURL=update-theme.dto.js.map
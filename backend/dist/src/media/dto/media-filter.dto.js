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
exports.MediaFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class MediaFilterDto {
    mediaType;
    folderId;
    search;
    static _OPENAPI_METADATA_FACTORY() {
        return { mediaType: { required: false, enum: ["IMAGE", "VIDEO", "PDF", "DOCUMENT", "AUDIO", "ARCHIVE", "OTHER"] }, folderId: { required: false, type: () => String }, search: { required: false, type: () => String } };
    }
}
exports.MediaFilterDto = MediaFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.MediaTypeEnum, description: 'Filter by media type (IMAGE, VIDEO, PDF, etc.)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.MediaTypeEnum),
    __metadata("design:type", String)
], MediaFilterDto.prototype, "mediaType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Filter by folder UUID or "root"' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MediaFilterDto.prototype, "folderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'logo', description: 'Search term for file name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MediaFilterDto.prototype, "search", void 0);
//# sourceMappingURL=media-filter.dto.js.map
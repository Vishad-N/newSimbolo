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
exports.MoveAssetDto = exports.RenameAssetDto = exports.UploadRequestDto = exports.CreateAssetFolderDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAssetFolderDto {
    name;
    parentId;
    clientId;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, parentId: { required: false, type: () => String, format: "uuid" }, clientId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateAssetFolderDto = CreateAssetFolderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Brand Assets' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetFolderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Parent folder UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetFolderDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetFolderDto.prototype, "clientId", void 0);
class UploadRequestDto {
    filename;
    mimeType;
    sizeBytes;
    folderId;
    clientId;
    static _OPENAPI_METADATA_FACTORY() {
        return { filename: { required: true, type: () => String }, mimeType: { required: true, type: () => String }, sizeBytes: { required: true, type: () => Number }, folderId: { required: false, type: () => String, format: "uuid" }, clientId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.UploadRequestDto = UploadRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'logo.png' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadRequestDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/png' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadRequestDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 102400 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UploadRequestDto.prototype, "sizeBytes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UploadRequestDto.prototype, "folderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UploadRequestDto.prototype, "clientId", void 0);
class RenameAssetDto {
    name;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String } };
    }
}
exports.RenameAssetDto = RenameAssetDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RenameAssetDto.prototype, "name", void 0);
class MoveAssetDto {
    folderId;
    static _OPENAPI_METADATA_FACTORY() {
        return { folderId: { required: false, type: () => String, nullable: true, format: "uuid" } };
    }
}
exports.MoveAssetDto = MoveAssetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], MoveAssetDto.prototype, "folderId", void 0);
//# sourceMappingURL=asset.dto.js.map
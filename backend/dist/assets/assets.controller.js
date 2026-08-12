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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assets_service_1 = require("./assets.service");
const asset_dto_1 = require("./dto/asset.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AssetsController = class AssetsController {
    assetsService;
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    getFolders(clientId) {
        return this.assetsService.getFolders(clientId);
    }
    createFolder(clientId, dto) {
        return this.assetsService.createFolder(clientId, dto);
    }
    renameFolder(clientId, folderId, dto) {
        return this.assetsService.renameFolder(folderId, clientId, dto);
    }
    deleteFolder(clientId, folderId) {
        return this.assetsService.deleteFolder(folderId, clientId);
    }
    getAssets(clientId, folderId) {
        // If folderId is 'root', we can pass null to the service or handle appropriately.
        const fid = folderId === 'root' ? null : folderId;
        return this.assetsService.getAssets(clientId, fid);
    }
    createUploadRequest(clientId, dto, user) {
        return this.assetsService.createUploadRequest(clientId, user.id, dto);
    }
    getDownloadUrl(clientId, assetId) {
        return this.assetsService.getSignedDownloadUrl(assetId, clientId);
    }
    renameAsset(clientId, assetId, dto) {
        return this.assetsService.renameAsset(assetId, clientId, dto);
    }
    moveAsset(clientId, assetId, dto) {
        return this.assetsService.moveAsset(assetId, clientId, dto);
    }
    deleteAsset(clientId, assetId) {
        return this.assetsService.deleteAsset(assetId, clientId);
    }
    getStorageUsage(clientId) {
        return this.assetsService.getStorageUsage(clientId);
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Get)('folders/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all folders for a client' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "getFolders", null);
__decorate([
    (0, common_1.Post)('folders/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new folder' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, asset_dto_1.CreateAssetFolderDto]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Patch)('folders/:clientId/:folderId/rename'),
    (0, swagger_1.ApiOperation)({ summary: 'Rename a folder' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('folderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, asset_dto_1.RenameAssetDto]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "renameFolder", null);
__decorate([
    (0, common_1.Delete)('folders/:clientId/:folderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a folder' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('folderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "deleteFolder", null);
__decorate([
    openapi.ApiQuery({ name: "folderId", required: false }),
    (0, common_1.Get)(':clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assets for a client, optionally filtered by folder' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Query)('folderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "getAssets", null);
__decorate([
    (0, common_1.Post)(':clientId/upload-request'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a presigned URL to upload a file' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, asset_dto_1.UploadRequestDto, Object]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "createUploadRequest", null);
__decorate([
    (0, common_1.Get)(':clientId/:assetId/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a presigned URL to download a file' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "getDownloadUrl", null);
__decorate([
    (0, common_1.Patch)(':clientId/:assetId/rename'),
    (0, swagger_1.ApiOperation)({ summary: 'Rename a file' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('assetId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, asset_dto_1.RenameAssetDto]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "renameAsset", null);
__decorate([
    (0, common_1.Patch)(':clientId/:assetId/move'),
    (0, swagger_1.ApiOperation)({ summary: 'Move a file to another folder' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('assetId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, asset_dto_1.MoveAssetDto]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "moveAsset", null);
__decorate([
    (0, common_1.Delete)(':clientId/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a file' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "deleteAsset", null);
__decorate([
    (0, common_1.Get)('storage-usage/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get storage usage for a client' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "getStorageUsage", null);
exports.AssetsController = AssetsController = __decorate([
    (0, swagger_1.ApiTags)('Client Assets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('assets'),
    __metadata("design:paramtypes", [assets_service_1.AssetsService])
], AssetsController);
//# sourceMappingURL=assets.controller.js.map
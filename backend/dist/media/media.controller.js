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
exports.MediaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const media_service_1 = require("./media.service");
const create_media_folder_dto_1 = require("./dto/create-media-folder.dto");
const update_media_asset_dto_1 = require("./dto/update-media-asset.dto");
const media_filter_dto_1 = require("./dto/media-filter.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let MediaController = class MediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async uploadFile(file, user, folderId) {
        return this.mediaService.uploadFile(file, user?.sub, folderId);
    }
    async getAssets(filter) {
        return this.mediaService.getAssets(filter);
    }
    async getFolders(parentId) {
        return this.mediaService.getFolders(parentId);
    }
    async createFolder(dto) {
        return this.mediaService.createFolder(dto);
    }
    async deleteFolder(id) {
        return this.mediaService.deleteFolder(id);
    }
    async getAssetById(id) {
        return this.mediaService.getAssetById(id);
    }
    async updateAsset(id, dto) {
        return this.mediaService.updateAsset(id, dto);
    }
    async deleteAsset(id) {
        return this.mediaService.deleteAsset(id);
    }
};
exports.MediaController = MediaController;
__decorate([
    openapi.ApiQuery({ name: "folderId", required: false }),
    (0, common_1.Post)('upload'),
    (0, permissions_decorator_1.Permissions)('media.upload', 'content.create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a media asset (image, video, PDF, document)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'The media file to upload' },
                folderId: { type: 'string', format: 'uuid', description: 'Optional destination folder UUID' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File uploaded successfully' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('folderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('media.read', 'content.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of media assets with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Media asset list returned' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [media_filter_dto_1.MediaFilterDto]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getAssets", null);
__decorate([
    openapi.ApiQuery({ name: "parentId", required: false }),
    (0, common_1.Get)('folders'),
    (0, permissions_decorator_1.Permissions)('media.read', 'content.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get media folder tree hierarchy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Folders returned' }),
    __param(0, (0, common_1.Query)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getFolders", null);
__decorate([
    (0, common_1.Post)('folders'),
    (0, permissions_decorator_1.Permissions)('media.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new media folder' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Folder created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_media_folder_dto_1.CreateMediaFolderDto]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Delete)('folders/:id'),
    (0, permissions_decorator_1.Permissions)('media.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an empty media folder' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Folder deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "deleteFolder", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('media.read', 'content.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single media asset details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset details returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getAssetById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('media.manage', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update media asset metadata (file name, destination folder)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_media_asset_dto_1.UpdateMediaAssetDto]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "updateAsset", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('media.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a media asset from database and disk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "deleteAsset", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('Media Library & File Storage'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map
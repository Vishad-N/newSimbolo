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
exports.WebsiteMediaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const website_media_service_1 = require("./website-media.service");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let WebsiteMediaController = class WebsiteMediaController {
    websiteMediaService;
    constructor(websiteMediaService) {
        this.websiteMediaService = websiteMediaService;
    }
    async uploadFile(file, user, folder) {
        const targetFolder = folder || 'general';
        return this.websiteMediaService.uploadFile(file, targetFolder, user?.sub);
    }
    async getAssets(folder) {
        return this.websiteMediaService.getAssets(folder);
    }
    async getAssetById(id) {
        return this.websiteMediaService.getAssetById(id);
    }
    async deleteAsset(id) {
        return this.websiteMediaService.deleteAsset(id);
    }
};
exports.WebsiteMediaController = WebsiteMediaController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, permissions_decorator_1.Permissions)('media.upload', 'content.create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a website asset to Cloudinary' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'The media file to upload' },
                folder: { type: 'string', description: 'Destination folder in Cloudinary (e.g. "blogs", "services")' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File uploaded successfully' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], WebsiteMediaController.prototype, "uploadFile", null);
__decorate([
    openapi.ApiQuery({ name: "folder", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('media.read', 'content.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of website media assets from database' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Media asset list returned' }),
    __param(0, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebsiteMediaController.prototype, "getAssets", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('media.read', 'content.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single website media asset details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset details returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebsiteMediaController.prototype, "getAssetById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('media.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a website media asset from database and Cloudinary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebsiteMediaController.prototype, "deleteAsset", null);
exports.WebsiteMediaController = WebsiteMediaController = __decorate([
    (0, swagger_1.ApiTags)('Website Media (Cloudinary)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('website-media'),
    __metadata("design:paramtypes", [website_media_service_1.WebsiteMediaService])
], WebsiteMediaController);
//# sourceMappingURL=website-media.controller.js.map
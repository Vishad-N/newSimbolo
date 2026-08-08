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
exports.WebsiteMediaService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("../shared/cloudinary/cloudinary.service");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let WebsiteMediaService = class WebsiteMediaService extends base_service_1.BaseService {
    prisma;
    cloudinary;
    constructor(prisma, cloudinary) {
        super('WebsiteMediaService');
        this.prisma = prisma;
        this.cloudinary = cloudinary;
    }
    async uploadFile(file, folder, uploaderId) {
        if (!file) {
            throw new custom_exceptions_1.BusinessException('No file provided for upload');
        }
        try {
            const result = await this.cloudinary.uploadImage(file, folder);
            const media = await this.prisma.media.create({
                data: {
                    publicId: result.public_id,
                    url: result.url,
                    secureUrl: result.secure_url,
                    folder: result.folder || folder,
                    filename: result.original_filename || file.originalname,
                    format: result.format || 'unknown',
                    resourceType: result.resource_type,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes,
                    uploadedById: uploaderId || null,
                },
            });
            this.logger.log(`Uploaded website media asset "${media.filename}" (ID: ${media.id})`);
            return media;
        }
        catch (error) {
            this.logger.error(`Failed to upload to Cloudinary: ${error.message}`, error.stack);
            throw new custom_exceptions_1.BusinessException('Failed to upload file to Cloudinary');
        }
    }
    async getAssets(folder) {
        const where = folder ? { folder } : {};
        return this.prisma.media.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });
    }
    async getAssetById(id) {
        const asset = await this.prisma.media.findUnique({
            where: { id },
        });
        return this.checkEntityExists(asset, 'Media', id);
    }
    async deleteAsset(id) {
        const asset = await this.getAssetById(id);
        await this.cloudinary.deleteImage(asset.publicId);
        await this.prisma.media.delete({ where: { id } });
        this.logger.log(`Deleted website media asset ID: ${id}`);
        return { success: true };
    }
};
exports.WebsiteMediaService = WebsiteMediaService;
exports.WebsiteMediaService = WebsiteMediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], WebsiteMediaService);
//# sourceMappingURL=website-media.service.js.map
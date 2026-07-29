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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
const storage_service_1 = require("../storage/storage.service");
const fs = require("fs");
const path = require("path");
let MediaService = class MediaService extends base_service_1.BaseService {
    prisma;
    storageService;
    uploadDir = path.join(process.cwd(), 'uploads');
    constructor(prisma, storageService) {
        super('MediaService');
        this.prisma = prisma;
        this.storageService = storageService;
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    determineMediaType(mimeType) {
        if (mimeType.startsWith('image/'))
            return client_1.MediaTypeEnum.IMAGE;
        if (mimeType.startsWith('video/'))
            return client_1.MediaTypeEnum.VIDEO;
        if (mimeType === 'application/pdf')
            return client_1.MediaTypeEnum.PDF;
        if (mimeType.startsWith('audio/'))
            return client_1.MediaTypeEnum.AUDIO;
        if (mimeType.includes('zip') ||
            mimeType.includes('tar') ||
            mimeType.includes('compressed') ||
            mimeType.includes('archive')) {
            return client_1.MediaTypeEnum.ARCHIVE;
        }
        if (mimeType.includes('word') ||
            mimeType.includes('excel') ||
            mimeType.includes('powerpoint') ||
            mimeType.includes('text/') ||
            mimeType.includes('document')) {
            return client_1.MediaTypeEnum.DOCUMENT;
        }
        return client_1.MediaTypeEnum.OTHER;
    }
    async uploadFile(file, uploaderId, folderId) {
        if (!file) {
            throw new custom_exceptions_1.BusinessException('No file provided for upload');
        }
        if (folderId) {
            const folder = await this.prisma.mediaFolder.findUnique({ where: { id: folderId } });
            this.checkEntityExists(folder, 'MediaFolder', folderId);
        }
        const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '') || 'bin';
        const storageKey = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
        const targetPath = path.join(this.uploadDir, storageKey);
        const storedObject = await this.storageService.upload(file, storageKey);
        const mediaType = this.determineMediaType(file.mimetype);
        const cdnUrl = storedObject.url;
        const asset = await this.prisma.mediaAsset.create({
            data: {
                fileName: file.originalname,
                originalName: file.originalname,
                mimeType: file.mimetype,
                fileExtension,
                sizeBytes: file.size,
                cdnUrl,
                storageKey: storedObject.storageKey,
                mediaType,
                folderId: folderId || null,
                uploaderId: uploaderId || null,
            },
        });
        this.logger.log(`Uploaded media asset "${asset.fileName}" (ID: ${asset.id})`);
        return asset;
    }
    async getAssets(filter) {
        const where = { deletedAt: null };
        if (filter.mediaType) {
            where.mediaType = filter.mediaType;
        }
        if (filter.folderId) {
            where.folderId = filter.folderId === 'root' ? null : filter.folderId;
        }
        if (filter.search) {
            where.fileName = { contains: filter.search, mode: 'insensitive' };
        }
        return this.prisma.mediaAsset.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { folder: true, uploader: { select: { id: true, firstName: true, lastName: true, email: true } } },
        });
    }
    async getAssetById(id) {
        const asset = await this.prisma.mediaAsset.findUnique({
            where: { id },
            include: { folder: true, uploader: { select: { id: true, firstName: true, lastName: true, email: true } } },
        });
        return this.checkEntityExists(asset, 'MediaAsset', id);
    }
    async updateAsset(id, dto) {
        await this.getAssetById(id);
        if (dto.folderId) {
            const folder = await this.prisma.mediaFolder.findUnique({ where: { id: dto.folderId } });
            this.checkEntityExists(folder, 'MediaFolder', dto.folderId);
        }
        return this.prisma.mediaAsset.update({
            where: { id },
            data: {
                ...(dto.fileName !== undefined && { fileName: dto.fileName }),
                ...(dto.folderId !== undefined && { folderId: dto.folderId }),
            },
        });
    }
    async deleteAsset(id) {
        const asset = await this.getAssetById(id);
        await this.storageService.delete(asset.storageKey);
        await this.prisma.mediaAsset.delete({ where: { id } });
        this.logger.log(`Deleted media asset ID: ${id}`);
        return { success: true };
    }
    async createFolder(dto) {
        const slug = dto.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        if (dto.parentId) {
            const parent = await this.prisma.mediaFolder.findUnique({ where: { id: dto.parentId } });
            this.checkEntityExists(parent, 'MediaFolder', dto.parentId);
        }
        return this.prisma.mediaFolder.create({
            data: {
                name: dto.name,
                slug,
                parentId: dto.parentId || null,
            },
        });
    }
    async getFolders(parentId) {
        return this.prisma.mediaFolder.findMany({
            where: parentId ? { parentId } : { parentId: null },
            include: {
                children: true,
                _count: { select: { assets: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async deleteFolder(id) {
        const folder = await this.prisma.mediaFolder.findUnique({
            where: { id },
            include: { _count: { select: { children: true, assets: true } } },
        });
        const validFolder = this.checkEntityExists(folder, 'MediaFolder', id);
        if (validFolder._count.children > 0 || validFolder._count.assets > 0) {
            throw new custom_exceptions_1.CustomConflictException('Cannot delete folder that contains assets or subfolders');
        }
        await this.prisma.mediaFolder.delete({ where: { id } });
        this.logger.log(`Deleted media folder ID: ${id}`);
        return { success: true };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], MediaService);
//# sourceMappingURL=media.service.js.map
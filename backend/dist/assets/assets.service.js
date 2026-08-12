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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const crypto_1 = require("crypto");
const path = require("path");
let AssetsService = class AssetsService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    // =====================================
    // FOLDERS
    // =====================================
    async getFolders(clientId) {
        return this.prisma.assetFolder.findMany({
            where: { clientId },
            orderBy: { name: 'asc' },
        });
    }
    async createFolder(clientId, dto) {
        return this.prisma.assetFolder.create({
            data: {
                name: dto.name,
                parentId: dto.parentId,
                clientId,
            },
        });
    }
    async renameFolder(id, clientId, dto) {
        return this.prisma.assetFolder.updateMany({
            where: { id, clientId },
            data: { name: dto.name },
        });
    }
    async deleteFolder(id, clientId) {
        // In a real app we'd recursively delete or check for contents
        await this.prisma.assetFolder.deleteMany({
            where: { id, clientId },
        });
    }
    // =====================================
    // ASSETS
    // =====================================
    async getAssets(clientId, folderId) {
        const where = { clientId, deletedAt: null };
        if (folderId !== undefined) {
            where.folderId = folderId;
        }
        return this.prisma.asset.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                uploadedBy: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
    }
    async createUploadRequest(clientId, userId, dto) {
        const ext = path.extname(dto.filename);
        const storageKey = `client-${clientId}/${(0, crypto_1.randomUUID)()}${ext}`;
        // Generate the presigned URL
        const uploadUrl = await this.storage.getPresignedUploadUrl(storageKey, dto.mimeType);
        // Create a draft record
        const asset = await this.prisma.asset.create({
            data: {
                filename: dto.filename,
                originalName: dto.filename,
                mimeType: dto.mimeType,
                extension: ext,
                sizeBytes: dto.sizeBytes,
                storageKey,
                clientId,
                folderId: dto.folderId,
                uploadedById: userId,
            },
        });
        return { uploadUrl, asset };
    }
    async getSignedDownloadUrl(id, clientId) {
        const asset = await this.prisma.asset.findFirst({
            where: { id, clientId, deletedAt: null },
        });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        const url = await this.storage.getSignedUrl(asset.storageKey, 3600);
        return { url };
    }
    async renameAsset(id, clientId, dto) {
        return this.prisma.asset.updateMany({
            where: { id, clientId, deletedAt: null },
            data: { filename: dto.name },
        });
    }
    async moveAsset(id, clientId, dto) {
        return this.prisma.asset.updateMany({
            where: { id, clientId, deletedAt: null },
            data: { folderId: dto.folderId },
        });
    }
    async deleteAsset(id, clientId) {
        return this.prisma.asset.updateMany({
            where: { id, clientId },
            data: { deletedAt: new Date() },
        });
    }
    async getStorageUsage(clientId) {
        const result = await this.prisma.asset.aggregate({
            where: { clientId, deletedAt: null },
            _sum: { sizeBytes: true },
        });
        const usedBytes = result._sum.sizeBytes || 0;
        const limitBytes = 10 * 1024 * 1024 * 1024; // 10 GB
        return { usedBytes, limitBytes };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map
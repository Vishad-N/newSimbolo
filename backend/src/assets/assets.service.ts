import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateAssetFolderDto, UploadRequestDto, RenameAssetDto, MoveAssetDto } from './dto/asset.dto';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class AssetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  // =====================================
  // FOLDERS
  // =====================================
  
  async getFolders(clientId: string) {
    return this.prisma.assetFolder.findMany({
      where: { clientId },
      orderBy: { name: 'asc' },
    });
  }

  async createFolder(clientId: string, dto: CreateAssetFolderDto) {
    return this.prisma.assetFolder.create({
      data: {
        name: dto.name,
        parentId: dto.parentId,
        clientId,
      },
    });
  }

  async renameFolder(id: string, clientId: string, dto: RenameAssetDto) {
    return this.prisma.assetFolder.updateMany({
      where: { id, clientId },
      data: { name: dto.name },
    });
  }

  async deleteFolder(id: string, clientId: string) {
    // In a real app we'd recursively delete or check for contents
    await this.prisma.assetFolder.deleteMany({
      where: { id, clientId },
    });
  }

  // =====================================
  // ASSETS
  // =====================================

  async getAssets(clientId: string, folderId?: string | null) {
    const where: any = { clientId, deletedAt: null };
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
      }
    });
  }

  async createUploadRequest(clientId: string, userId: string, dto: UploadRequestDto) {
    const ext = path.extname(dto.filename);
    const storageKey = `client-${clientId}/${randomUUID()}${ext}`;
    
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

  async getSignedDownloadUrl(id: string, clientId: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, clientId, deletedAt: null },
    });
    if (!asset) throw new NotFoundException('Asset not found');

    const url = await this.storage.getSignedUrl(asset.storageKey, 3600);
    return { url };
  }

  async renameAsset(id: string, clientId: string, dto: RenameAssetDto) {
    return this.prisma.asset.updateMany({
      where: { id, clientId, deletedAt: null },
      data: { filename: dto.name },
    });
  }

  async moveAsset(id: string, clientId: string, dto: MoveAssetDto) {
    return this.prisma.asset.updateMany({
      where: { id, clientId, deletedAt: null },
      data: { folderId: dto.folderId },
    });
  }

  async deleteAsset(id: string, clientId: string) {
    return this.prisma.asset.updateMany({
      where: { id, clientId },
      data: { deletedAt: new Date() },
    });
  }

  async getStorageUsage(clientId: string) {
    const result = await this.prisma.asset.aggregate({
      where: { clientId, deletedAt: null },
      _sum: { sizeBytes: true },
    });
    const usedBytes = result._sum.sizeBytes || 0;
    const limitBytes = 10 * 1024 * 1024 * 1024; // 10 GB
    return { usedBytes, limitBytes };
  }
}

import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaFolderDto } from './dto/create-media-folder.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { MediaFilterDto } from './dto/media-filter.dto';
import { MediaTypeEnum, MediaAsset, MediaFolder } from '@prisma/client';
import { CustomConflictException, BusinessException } from '../common/exceptions/custom.exceptions';
import { StorageService } from '../storage/storage.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService extends BaseService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {
    super('MediaService');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private determineMediaType(mimeType: string): MediaTypeEnum {
    if (mimeType.startsWith('image/')) return MediaTypeEnum.IMAGE;
    if (mimeType.startsWith('video/')) return MediaTypeEnum.VIDEO;
    if (mimeType === 'application/pdf') return MediaTypeEnum.PDF;
    if (mimeType.startsWith('audio/')) return MediaTypeEnum.AUDIO;
    if (
      mimeType.includes('zip') ||
      mimeType.includes('tar') ||
      mimeType.includes('compressed') ||
      mimeType.includes('archive')
    ) {
      return MediaTypeEnum.ARCHIVE;
    }
    if (
      mimeType.includes('word') ||
      mimeType.includes('excel') ||
      mimeType.includes('powerpoint') ||
      mimeType.includes('text/') ||
      mimeType.includes('document')
    ) {
      return MediaTypeEnum.DOCUMENT;
    }
    return MediaTypeEnum.OTHER;
  }

  async uploadFile(file: Express.Multer.File, uploaderId?: string, folderId?: string): Promise<MediaAsset> {
    if (!file) {
      throw new BusinessException('No file provided for upload');
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

  async getAssets(filter: MediaFilterDto): Promise<MediaAsset[]> {
    const where: any = { deletedAt: null };

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

  async getAssetById(id: string): Promise<MediaAsset> {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id },
      include: { folder: true, uploader: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    return this.checkEntityExists(asset, 'MediaAsset', id);
  }

  async updateAsset(id: string, dto: UpdateMediaAssetDto): Promise<MediaAsset> {
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

  async deleteAsset(id: string): Promise<{ success: boolean }> {
    const asset = await this.getAssetById(id);
    await this.storageService.delete(asset.storageKey);

    await this.prisma.mediaAsset.delete({ where: { id } });
    this.logger.log(`Deleted media asset ID: ${id}`);
    return { success: true };
  }

  async createFolder(dto: CreateMediaFolderDto): Promise<MediaFolder> {
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

  async getFolders(parentId?: string): Promise<MediaFolder[]> {
    return this.prisma.mediaFolder.findMany({
      where: parentId ? { parentId } : { parentId: null },
      include: {
        children: true,
        _count: { select: { assets: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async deleteFolder(id: string): Promise<{ success: boolean }> {
    const folder = await this.prisma.mediaFolder.findUnique({
      where: { id },
      include: { _count: { select: { children: true, assets: true } } },
    });
    const validFolder = this.checkEntityExists(folder, 'MediaFolder', id);

    if (validFolder._count.children > 0 || validFolder._count.assets > 0) {
      throw new CustomConflictException('Cannot delete folder that contains assets or subfolders');
    }

    await this.prisma.mediaFolder.delete({ where: { id } });
    this.logger.log(`Deleted media folder ID: ${id}`);
    return { success: true };
  }
}

import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaFolderDto } from './dto/create-media-folder.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { MediaFilterDto } from './dto/media-filter.dto';
import { MediaAsset, MediaFolder } from '@prisma/client';
export declare class MediaService extends BaseService {
    private readonly prisma;
    private readonly uploadDir;
    constructor(prisma: PrismaService);
    private determineMediaType;
    uploadFile(file: Express.Multer.File, uploaderId?: string, folderId?: string): Promise<MediaAsset>;
    getAssets(filter: MediaFilterDto): Promise<MediaAsset[]>;
    getAssetById(id: string): Promise<MediaAsset>;
    updateAsset(id: string, dto: UpdateMediaAssetDto): Promise<MediaAsset>;
    deleteAsset(id: string): Promise<{
        success: boolean;
    }>;
    createFolder(dto: CreateMediaFolderDto): Promise<MediaFolder>;
    getFolders(parentId?: string): Promise<MediaFolder[]>;
    deleteFolder(id: string): Promise<{
        success: boolean;
    }>;
}

import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../shared/cloudinary/cloudinary.service';
import { Media } from '@prisma/client';
export declare class WebsiteMediaService extends BaseService {
    private readonly prisma;
    private readonly cloudinary;
    constructor(prisma: PrismaService, cloudinary: CloudinaryService);
    uploadFile(file: Express.Multer.File, folder: string, uploaderId?: string): Promise<Media>;
    getAssets(folder?: string): Promise<Media[]>;
    getAssetById(id: string): Promise<Media>;
    deleteAsset(id: string): Promise<{
        success: boolean;
    }>;
}

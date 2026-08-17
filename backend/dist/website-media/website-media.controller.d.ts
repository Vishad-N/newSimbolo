import { WebsiteMediaService } from './website-media.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class WebsiteMediaController {
    private readonly websiteMediaService;
    constructor(websiteMediaService: WebsiteMediaService);
    uploadFile(file: Express.Multer.File, user: JwtPayload, folder?: string): Promise<{
        url: string;
        format: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        folder: string;
        width: number | null;
        height: number | null;
        publicId: string;
        secureUrl: string;
        filename: string;
        resourceType: string;
        bytes: number | null;
        uploadedById: string | null;
    }>;
    getAssets(folder?: string): Promise<{
        url: string;
        format: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        folder: string;
        width: number | null;
        height: number | null;
        publicId: string;
        secureUrl: string;
        filename: string;
        resourceType: string;
        bytes: number | null;
        uploadedById: string | null;
    }[]>;
    getAssetById(id: string): Promise<{
        url: string;
        format: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        folder: string;
        width: number | null;
        height: number | null;
        publicId: string;
        secureUrl: string;
        filename: string;
        resourceType: string;
        bytes: number | null;
        uploadedById: string | null;
    }>;
    deleteAsset(id: string): Promise<{
        success: boolean;
    }>;
}

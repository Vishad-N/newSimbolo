import { AssetsService } from './assets.service';
import { CreateAssetFolderDto, UploadRequestDto, RenameAssetDto, MoveAssetDto } from './dto/asset.dto';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    getFolders(clientId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        parentId: string | null;
        clientId: string;
    }[]>;
    createFolder(clientId: string, dto: CreateAssetFolderDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        parentId: string | null;
        clientId: string;
    }>;
    renameFolder(clientId: string, folderId: string, dto: RenameAssetDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteFolder(clientId: string, folderId: string): Promise<void>;
    getAssets(clientId: string, folderId?: string): Promise<({
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        folderId: string | null;
        storageKey: string;
        originalName: string;
        mimeType: string;
        sizeBytes: number;
        filename: string;
        uploadedById: string | null;
        clientId: string;
        extension: string;
        storageProvider: string;
    })[]>;
    createUploadRequest(clientId: string, dto: UploadRequestDto, user: any): Promise<{
        uploadUrl: string;
        asset: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            folderId: string | null;
            storageKey: string;
            originalName: string;
            mimeType: string;
            sizeBytes: number;
            filename: string;
            uploadedById: string | null;
            clientId: string;
            extension: string;
            storageProvider: string;
        };
    }>;
    getDownloadUrl(clientId: string, assetId: string): Promise<{
        url: string;
    }>;
    renameAsset(clientId: string, assetId: string, dto: RenameAssetDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    moveAsset(clientId: string, assetId: string, dto: MoveAssetDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteAsset(clientId: string, assetId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getStorageUsage(clientId: string): Promise<{
        usedBytes: number;
        limitBytes: number;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateAssetFolderDto, UploadRequestDto, RenameAssetDto, MoveAssetDto } from './dto/asset.dto';
export declare class AssetsService {
    private readonly prisma;
    private readonly storage;
    constructor(prisma: PrismaService, storage: StorageService);
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
    renameFolder(id: string, clientId: string, dto: RenameAssetDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteFolder(id: string, clientId: string): Promise<void>;
    getAssets(clientId: string, folderId?: string | null): Promise<({
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
    createUploadRequest(clientId: string, userId: string, dto: UploadRequestDto): Promise<{
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
    getSignedDownloadUrl(id: string, clientId: string): Promise<{
        url: string;
    }>;
    renameAsset(id: string, clientId: string, dto: RenameAssetDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    moveAsset(id: string, clientId: string, dto: MoveAssetDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteAsset(id: string, clientId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getStorageUsage(clientId: string): Promise<{
        usedBytes: number;
        limitBytes: number;
    }>;
}

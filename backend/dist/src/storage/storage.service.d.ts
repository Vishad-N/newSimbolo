import { ConfigService } from '@nestjs/config';
import { BaseService } from '../shared/abstractions/base.service';
import { LocalStorageProvider, StoredObject } from './storage.provider';
import { S3StorageProvider } from './s3.provider';
export declare class StorageService extends BaseService {
    private readonly configService;
    private readonly localStorageProvider;
    private readonly s3StorageProvider;
    private readonly maxFileSizeBytes;
    constructor(configService: ConfigService, localStorageProvider: LocalStorageProvider, s3StorageProvider: S3StorageProvider);
    upload(file: Express.Multer.File, storageKey: string): Promise<StoredObject>;
    delete(storageKey: string): Promise<void>;
    getSignedUrl(storageKey: string, expiresInSeconds?: number): Promise<string>;
    getPresignedUploadUrl(storageKey: string, mimeType: string, expiresInSeconds?: number): Promise<any>;
    health(): Promise<"disabled" | "up" | "down" | "configured">;
    validateFile(file: Express.Multer.File): void;
    private getProvider;
}

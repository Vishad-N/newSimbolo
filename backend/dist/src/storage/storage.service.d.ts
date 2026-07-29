import { ConfigService } from '@nestjs/config';
import { BaseService } from '../shared/abstractions/base.service';
import { LocalStorageProvider, StoredObject } from './storage.provider';
export declare class StorageService extends BaseService {
    private readonly configService;
    private readonly localStorageProvider;
    private readonly maxFileSizeBytes;
    constructor(configService: ConfigService, localStorageProvider: LocalStorageProvider);
    upload(file: Express.Multer.File, storageKey: string): Promise<StoredObject>;
    delete(storageKey: string): Promise<void>;
    getSignedUrl(storageKey: string, expiresInSeconds?: number): Promise<string>;
    health(): Promise<"up" | "disabled" | "down" | "configured">;
    validateFile(file: Express.Multer.File): void;
    private getProvider;
}

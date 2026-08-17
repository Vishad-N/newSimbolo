import { ConfigService } from '@nestjs/config';
export interface StoredObject {
    storageKey: string;
    url: string;
    provider: string;
}
export interface StorageProvider {
    upload(buffer: Buffer, key: string, mimeType: string): Promise<StoredObject>;
    delete(key: string): Promise<void>;
    getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
    health(): Promise<'up' | 'configured' | 'disabled' | 'down'>;
}
export declare class LocalStorageProvider implements StorageProvider {
    private readonly configService;
    private readonly uploadDir;
    constructor(configService: ConfigService);
    upload(buffer: Buffer, key: string, mimeType: string): Promise<StoredObject>;
    delete(key: string): Promise<void>;
    getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
    health(): Promise<'up' | 'configured'>;
}

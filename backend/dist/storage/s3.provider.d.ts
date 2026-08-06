import { ConfigService } from '@nestjs/config';
import { StorageProvider, StoredObject } from './storage.provider';
export declare class S3StorageProvider implements StorageProvider {
    private readonly configService;
    private readonly s3Client;
    private readonly bucketName;
    private readonly logger;
    constructor(configService: ConfigService);
    upload(buffer: Buffer, key: string, mimeType: string): Promise<StoredObject>;
    delete(key: string): Promise<void>;
    getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
    getPresignedUploadUrl(key: string, mimeType: string, expiresInSeconds?: number): Promise<string>;
    health(): Promise<'up' | 'configured' | 'disabled' | 'down'>;
}

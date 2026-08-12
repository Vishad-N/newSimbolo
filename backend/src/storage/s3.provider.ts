import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageProvider, StoredObject } from './storage.provider';

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(S3StorageProvider.name);

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID') || '';
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID') || '';
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY') || '';
    const endpoint =
      this.configService.get<string>('R2_ENDPOINT') ||
      (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || '';

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async upload(buffer: Buffer, key: string, mimeType: string): Promise<StoredObject> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    try {
      await this.s3Client.send(command);
      return {
        storageKey: key,
        url: `s3://${this.bucketName}/${key}`,
        provider: 'cloudflare-r2',
      };
    } catch (error) {
      this.logger.error(`Failed to upload ${key} to R2`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Failed to delete ${key} from R2`, error);
      throw error;
    }
  }

  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL for ${key}`, error);
      throw error;
    }
  }

  async getPresignedUploadUrl(key: string, mimeType: string, expiresInSeconds = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    } catch (error) {
      this.logger.error(`Failed to generate presigned upload URL for ${key}`, error);
      throw error;
    }
  }

  async health(): Promise<'up' | 'configured' | 'disabled' | 'down'> {
    try {
      const configured = [
        this.configService.get<string>('R2_ACCOUNT_ID'),
        this.configService.get<string>('R2_ACCESS_KEY_ID'),
        this.configService.get<string>('R2_SECRET_ACCESS_KEY'),
        this.configService.get<string>('R2_BUCKET_NAME'),
      ].every(Boolean);
      if (!configured) return 'disabled';
      return 'up';
    } catch (error) {
      return 'down';
    }
  }
}

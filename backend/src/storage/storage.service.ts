import { BadRequestException, Injectable, PayloadTooLargeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../shared/abstractions/base.service';
import { LocalStorageProvider, StorageProvider, StoredObject } from './storage.provider';

const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/', 'text/'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/zip',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

@Injectable()
export class StorageService extends BaseService {
  private readonly maxFileSizeBytes: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly localStorageProvider: LocalStorageProvider,
  ) {
    super('StorageService');
    this.maxFileSizeBytes = parseInt(process.env.MAX_UPLOAD_BYTES || `${25 * 1024 * 1024}`, 10);
  }

  async upload(file: Express.Multer.File, storageKey: string): Promise<StoredObject> {
    this.validateFile(file);
    const provider = this.getProvider();
    const buffer = file.buffer ?? Buffer.alloc(0);
    return provider.upload(buffer, storageKey, file.mimetype);
  }

  async delete(storageKey: string): Promise<void> {
    await this.getProvider().delete(storageKey);
  }

  async getSignedUrl(storageKey: string, expiresInSeconds?: number) {
    return this.getProvider().getSignedUrl(storageKey, expiresInSeconds);
  }

  async health() {
    return this.getProvider().health();
  }

  validateFile(file: Express.Multer.File): void {
    if (!file) throw new BadRequestException('No file provided');
    if (file.size > this.maxFileSizeBytes) {
      throw new PayloadTooLargeException(`File exceeds ${this.maxFileSizeBytes} bytes`);
    }
    const validMime =
      ALLOWED_MIME_TYPES.includes(file.mimetype) ||
      ALLOWED_MIME_PREFIXES.some((prefix) => file.mimetype.startsWith(prefix));
    if (!validMime) throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
  }

  private getProvider(): StorageProvider {
    const provider = this.configService.get<string>('storage.provider', 'local');
    if (provider === 'local' || provider === 's3' || provider === 'r2') return this.localStorageProvider;
    return this.localStorageProvider;
  }
}

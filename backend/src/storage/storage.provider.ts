import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

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

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async upload(buffer: Buffer, key: string, mimeType: string): Promise<StoredObject> {
    const filePath = path.join(this.uploadDir, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    return { storageKey: key, url: `/uploads/${key}`, provider: `local:${mimeType}` };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  async getSignedUrl(key: string, expiresInSeconds = 300): Promise<string> {
    return `/uploads/${key}?expiresIn=${expiresInSeconds}`;
  }

  async health(): Promise<'up' | 'configured'> {
    const provider = this.configService.get<string>('storage.provider');
    return provider && provider !== 'local' ? 'configured' : 'up';
  }
}

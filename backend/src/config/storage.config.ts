import { registerAs } from '@nestjs/config';
import { StorageConfig } from './configuration.interface';

export default registerAs('storage', (): StorageConfig => ({
  provider: process.env.STORAGE_PROVIDER || 'local',
  bucket: process.env.R2_BUCKET_NAME || process.env.STORAGE_BUCKET || '',
  region: process.env.STORAGE_REGION || 'auto',
  accessKey: process.env.R2_ACCESS_KEY_ID || process.env.STORAGE_ACCESS_KEY || '',
  secretKey: process.env.R2_SECRET_ACCESS_KEY || process.env.STORAGE_SECRET_KEY || '',
  endpoint: process.env.R2_ENDPOINT || process.env.STORAGE_ENDPOINT || '',
  cdnUrl: process.env.STORAGE_CDN_URL || '',
}));

import { registerAs } from '@nestjs/config';
import { StorageConfig } from './configuration.interface';

export default registerAs('storage', (): StorageConfig => ({
  provider: process.env.STORAGE_PROVIDER || 's3',
  bucket: process.env.STORAGE_BUCKET || 'simbolo-public-assets',
  region: process.env.STORAGE_REGION || 'ap-south-1',
  accessKey: process.env.STORAGE_ACCESS_KEY || '',
  secretKey: process.env.STORAGE_SECRET_KEY || '',
  endpoint: process.env.STORAGE_ENDPOINT || 'https://s3.ap-south-1.amazonaws.com',
  cdnUrl: process.env.STORAGE_CDN_URL || 'https://cdn.simbolo.ai',
}));

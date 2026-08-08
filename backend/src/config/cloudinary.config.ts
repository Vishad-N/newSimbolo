import { registerAs } from '@nestjs/config';
import { CloudinaryConfig } from './configuration.interface';

export default registerAs('cloudinary', (): CloudinaryConfig => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
}));

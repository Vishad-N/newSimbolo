import { registerAs } from '@nestjs/config';
import { AppConfig } from './configuration.interface';

export default registerAs('app', (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || process.env.API_PORT || '3000', 10),
  prefix: process.env.API_PREFIX || 'api',
  version: (process.env.API_VERSION || '1').replace(/^v/i, ''),
  frontendUrls: (
    process.env.FRONTEND_URLS || 'http://localhost:3000,http://localhost:3002,http://localhost:3003'
  ).split(','),
}));

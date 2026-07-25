import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './configuration.interface';

export default registerAs('database', (): DatabaseConfig => ({
  url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/simbolo?schema=public',
  poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
}));

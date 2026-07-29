import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL || '',
  enabled: Boolean(process.env.REDIS_URL),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'simbolo',
  defaultTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
}));

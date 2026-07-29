import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  it('uses in-memory fallback when Redis is not configured', async () => {
    const configService = {
      get: jest.fn((key: string, fallback?: unknown) => (key === 'redis.url' ? '' : fallback)),
    };
    const service = new CacheService(configService as unknown as ConfigService);

    await service.set('dashboard:admin', { value: 42 }, 30);

    await expect(service.get('dashboard:admin')).resolves.toEqual({ value: 42 });
    await expect(service.ping()).resolves.toBe('disabled');
  });
});

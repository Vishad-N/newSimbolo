import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { BaseService } from '../shared/abstractions/base.service';

@Injectable()
export class CacheService extends BaseService implements OnModuleDestroy {
  private readonly client?: Redis;
  private readonly memoryCache = new Map<string, { value: string; expiresAt: number }>();
  private readonly defaultTtlSeconds: number;

  constructor(private readonly configService: ConfigService) {
    super('CacheService');
    const redisUrl = this.configService.get<string>('redis.url');
    this.defaultTtlSeconds = this.configService.get<number>('redis.defaultTtlSeconds', 300);
    if (redisUrl) {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 2,
        lazyConnect: true,
        keyPrefix: `${this.configService.get<string>('redis.keyPrefix', 'simbolo')}:`,
      });
      this.client.on('error', (error) => this.logger.warn(`Redis cache unavailable: ${error.message}`));
    }
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    const rawValue = this.client ? await this.client.get(key) : this.getFromMemory(key);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = this.defaultTtlSeconds): Promise<void> {
    const serialized = JSON.stringify(value);
    if (this.client) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
      return;
    }
    this.memoryCache.set(key, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    if (!this.client) {
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(prefix)) this.memoryCache.delete(key);
      }
      return;
    }
    const keys = await this.client.keys(`${prefix}*`);
    if (keys.length > 0) await this.client.del(keys);
  }

  async ping(): Promise<'up' | 'disabled' | 'down'> {
    if (!this.client) return 'disabled';
    try {
      return (await this.client.ping()) === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }

  private getFromMemory(key: string): string | null {
    const record = this.memoryCache.get(key);
    if (!record) return null;
    if (record.expiresAt < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    return record.value;
  }
}

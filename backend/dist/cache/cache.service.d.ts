import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../shared/abstractions/base.service';
export declare class CacheService extends BaseService implements OnModuleDestroy {
    private readonly configService;
    private readonly client?;
    private readonly memoryCache;
    private readonly defaultTtlSeconds;
    constructor(configService: ConfigService);
    onModuleDestroy(): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    deleteByPrefix(prefix: string): Promise<void>;
    ping(): Promise<'up' | 'disabled' | 'down'>;
    private getFromMemory;
}

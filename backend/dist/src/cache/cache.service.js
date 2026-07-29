"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const base_service_1 = require("../shared/abstractions/base.service");
let CacheService = class CacheService extends base_service_1.BaseService {
    configService;
    client;
    memoryCache = new Map();
    defaultTtlSeconds;
    constructor(configService) {
        super('CacheService');
        this.configService = configService;
        const redisUrl = this.configService.get('redis.url');
        this.defaultTtlSeconds = this.configService.get('redis.defaultTtlSeconds', 300);
        if (redisUrl) {
            this.client = new ioredis_1.default(redisUrl, {
                maxRetriesPerRequest: 2,
                lazyConnect: true,
                keyPrefix: `${this.configService.get('redis.keyPrefix', 'simbolo')}:`,
            });
            this.client.on('error', (error) => this.logger.warn(`Redis cache unavailable: ${error.message}`));
        }
    }
    async onModuleDestroy() {
        await this.client?.quit();
    }
    async get(key) {
        const rawValue = this.client ? await this.client.get(key) : this.getFromMemory(key);
        return rawValue ? JSON.parse(rawValue) : null;
    }
    async set(key, value, ttlSeconds = this.defaultTtlSeconds) {
        const serialized = JSON.stringify(value);
        if (this.client) {
            await this.client.set(key, serialized, 'EX', ttlSeconds);
            return;
        }
        this.memoryCache.set(key, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 });
    }
    async deleteByPrefix(prefix) {
        if (!this.client) {
            for (const key of this.memoryCache.keys()) {
                if (key.startsWith(prefix))
                    this.memoryCache.delete(key);
            }
            return;
        }
        const keys = await this.client.keys(`${prefix}*`);
        if (keys.length > 0)
            await this.client.del(keys);
    }
    async ping() {
        if (!this.client)
            return 'disabled';
        try {
            return (await this.client.ping()) === 'PONG' ? 'up' : 'down';
        }
        catch {
            return 'down';
        }
    }
    getFromMemory(key) {
        const record = this.memoryCache.get(key);
        if (!record)
            return null;
        if (record.expiresAt < Date.now()) {
            this.memoryCache.delete(key);
            return null;
        }
        return record.value;
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map
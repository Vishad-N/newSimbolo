"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_service_1 = require("./cache.service");
describe('CacheService', () => {
    it('uses in-memory fallback when Redis is not configured', async () => {
        const configService = {
            get: jest.fn((key, fallback) => (key === 'redis.url' ? '' : fallback)),
        };
        const service = new cache_service_1.CacheService(configService);
        await service.set('dashboard:admin', { value: 42 }, 30);
        await expect(service.get('dashboard:admin')).resolves.toEqual({ value: 42 });
        await expect(service.ping()).resolves.toBe('disabled');
    });
});
//# sourceMappingURL=cache.service.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('redis', () => ({
    url: process.env.REDIS_URL || '',
    enabled: Boolean(process.env.REDIS_URL),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'simbolo',
    defaultTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
}));
//# sourceMappingURL=redis.config.js.map
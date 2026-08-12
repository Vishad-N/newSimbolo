"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('storage', () => ({
    provider: process.env.STORAGE_PROVIDER || 'local',
    bucket: process.env.R2_BUCKET_NAME || process.env.STORAGE_BUCKET || '',
    region: process.env.STORAGE_REGION || 'auto',
    accessKey: process.env.R2_ACCESS_KEY_ID || process.env.STORAGE_ACCESS_KEY || '',
    secretKey: process.env.R2_SECRET_ACCESS_KEY || process.env.STORAGE_SECRET_KEY || '',
    endpoint: process.env.R2_ENDPOINT || process.env.STORAGE_ENDPOINT || '',
    cdnUrl: process.env.STORAGE_CDN_URL || '',
}));
//# sourceMappingURL=storage.config.js.map
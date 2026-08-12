"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || process.env.API_PORT || '3001', 10),
    prefix: process.env.API_PREFIX || 'api',
    version: (process.env.API_VERSION || '1').replace(/^v/i, ''),
    frontendUrls: (process.env.FRONTEND_URLS || 'http://localhost:3000,http://localhost:3002,http://localhost:3003').split(','),
}));
//# sourceMappingURL=app.config.js.map
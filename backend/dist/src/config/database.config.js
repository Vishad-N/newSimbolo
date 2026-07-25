"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/simbolo?schema=public',
    poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
}));
//# sourceMappingURL=database.config.js.map
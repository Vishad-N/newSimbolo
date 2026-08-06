"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('observability', () => ({
    sentryDsn: process.env.SENTRY_DSN || '',
    sentryEnvironment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    release: process.env.APP_RELEASE || process.env.npm_package_version || 'local',
    metricsEnabled: process.env.METRICS_ENABLED !== 'false',
}));
//# sourceMappingURL=observability.config.js.map
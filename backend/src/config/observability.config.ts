import { registerAs } from '@nestjs/config';

export default registerAs('observability', () => ({
  sentryDsn: process.env.SENTRY_DSN || '',
  sentryEnvironment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
  release: process.env.APP_RELEASE || process.env.npm_package_version || 'local',
  metricsEnabled: process.env.METRICS_ENABLED !== 'false',
}));

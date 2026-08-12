import { NestFactory } from '@nestjs/core';
import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CustomLoggerService } from './shared/logger/logger.service';
import { RedisIoAdapter } from './realtime/redis-io.adapter';

const REDIS_STARTUP_TIMEOUT_MS = 2_000;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express') as typeof import('express');

export async function createExpressApplication() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    bufferLogs: true,
    rawBody: true,
  });
  await configureApplication(app);
  await app.init();
  return expressApp;
}

async function configureApplication(app: INestApplication): Promise<void> {
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>('app.nodeEnv') === 'production';
  const prefix = configService.get<string>('app.prefix', 'api');
  const version = configService.get<string>('app.version', '1').replace(/^v/i, '');
  const frontendUrls = configService.get<string[]>('app.frontendUrls', ['http://localhost:3000']);
  logger.log('Configuration loaded.', 'Bootstrap');
  logger.log('Database initialization completed. Prisma will connect lazily on first database operation.', 'Bootstrap');

  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  const livePayload = () => ({
    status: 'ok',
    service: 'simbolo-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
  app.getHttpAdapter().get('/', (_req, res) => {
    res.status(200).json(livePayload());
  });
  app.getHttpAdapter().get('/health/live', (_req, res) => {
    res.status(200).json(livePayload());
  });
  logger.log('Liveness endpoints registered at / and /health/live.', 'Bootstrap');
  logger.log('Trust proxy enabled for reverse proxy compatibility.', 'Bootstrap');

  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  app.use(compression());
  app.use(cookieParser(process.env.COOKIE_SECRET || process.env.JWT_SECRET));

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) {
        return callback(null, true);
      }

      if (origin && frontendUrls.includes(origin)) {
        return callback(null, true);
      }

      logger.warn(`Blocked CORS request from unauthorized origin: ${origin}`, 'CORS');
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, x-request-id',
  });

  if (process.env.REDIS_URL) {
    const redisIoAdapter = new RedisIoAdapter(app);
    try {
      await withTimeout(redisIoAdapter.connectToRedis(), REDIS_STARTUP_TIMEOUT_MS, 'Redis Socket.IO adapter startup timed out');
      app.useWebSocketAdapter(redisIoAdapter);
      logger.log('Redis initialization completed for WebSockets.', 'Bootstrap');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Redis startup error';
      logger.warn(`Redis unavailable; continuing without Redis WebSocket adapter. Reason: ${message}`, 'Bootstrap');
    }
  } else {
    logger.log('REDIS_URL not set; skipping Redis WebSocket adapter for Hostinger Business RAM limits.', 'Bootstrap');
  }

  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version,
  });
}

export async function bootstrap() {
  console.log('[Bootstrap] Application bootstrap started');
  const expressApp = await createExpressApplication();
  const isProduction = process.env.NODE_ENV === 'production';
  const port = resolveListenPort(Number(process.env.PORT || process.env.API_PORT || 3000), isProduction);
  assertValidPort(port);

  await new Promise<void>((resolve, reject) => {
    const server = expressApp.listen(port, '0.0.0.0', () => resolve());
    server.on('error', reject);
  });

  console.log('==========================================================');
  console.log(`The Simbolo Backend is running on: http://localhost:${port}/api/v1`);
  console.log(`HTTP server listening on 0.0.0.0:${port}`);
  console.log('==========================================================');
}

function resolveListenPort(configuredPort: number, isProduction: boolean): number {
  if (process.env.PORT) {
    return Number(process.env.PORT);
  }

  return isProduction ? 3000 : configuredPort;
}

function assertValidPort(port: number): void {
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT value. Expected an integer between 1 and 65535.`);
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

const launchedDirectly = typeof require !== 'undefined' && require.main === module;
if (launchedDirectly) {
  bootstrap().catch((err) => {
    console.error('Fatal error during application bootstrap:', err);
    process.exit(1);
  });
}

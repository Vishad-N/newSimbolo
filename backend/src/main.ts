import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CustomLoggerService } from './shared/logger/logger.service';
import { RedisIoAdapter } from './realtime/redis-io.adapter';

const REDIS_STARTUP_TIMEOUT_MS = 7_500;

async function bootstrap() {
  console.log('[Bootstrap] Application bootstrap started');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>('app.nodeEnv') === 'production';
  const port = resolveListenPort(configService.get<number>('app.port', 3000), isProduction);
  assertValidPort(port);
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

  const redisIoAdapter = new RedisIoAdapter(app);
  try {
    await withTimeout(redisIoAdapter.connectToRedis(), REDIS_STARTUP_TIMEOUT_MS, 'Redis Socket.IO adapter startup timed out');
    app.useWebSocketAdapter(redisIoAdapter);
    logger.log('Redis initialization completed for WebSockets.', 'Bootstrap');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Redis startup error';
    logger.warn(
      `Redis unavailable; continuing without Redis WebSocket adapter. Reason: ${message}`,
      'Bootstrap',
    );
  }

  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version,
  });

  const swaggerEnabled = !isProduction || process.env.SWAGGER_ENABLED === 'true';
  if (swaggerEnabled) {
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');
    const swaggerConfig = new DocumentBuilder()
      .setTitle('The Simbolo API')
      .setDescription(
        'Enterprise-grade AI-powered Digital Marketing Platform API serving Landing Website, Client Dashboard, and Admin CMS.',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT bearer token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Health', 'Real-time system health and database connectivity diagnostics')
      .addTag('Users', 'User identity and profile management foundation')
      .addTag('Payments', 'Razorpay payment gateway integration - order creation and HMAC signature verification')
      .addTag('Transactions', 'Immutable financial ledger and revenue analytics')
      .addTag('Webhooks', 'Secure inbound gateway webhook processing with signature validation')
      .addTag('Invoices', 'Invoice lifecycle - generation, PDF download, email dispatch, status management')
      .addTag('Subscriptions', 'Recurring billing management - pause, resume, upgrade, cancel, renewal reminders')
      .addTag('Notifications', 'In-app and email notification center with preference management')
      .addTag('Chat', 'Real-time project messaging via Socket.IO with REST fallback')
      .addTag('Comments', 'Threaded comments on tasks and project entities')
      .addTag('Activity', 'Activity feed and Timeline event tracking')
      .addTag('Analytics', 'Business intelligence analytics and KPI engine')
      .addTag('Reports', 'Dynamic report generation for revenue, clients, projects, operations, and content')
      .addTag('Exports', 'PDF, CSV, and Excel-compatible report exports')
      .addTag('AI', 'AI-assisted content generation through provider abstraction')
      .addTag('Insights', 'Stored business insights and operational recommendations')
      .addTag('Automation', 'Configurable workflow automation rules and trigger execution')
      .addTag('Search', 'Enterprise-wide ranked search and recent search history')
      .addTag('Audit', 'Searchable audit and business logs')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
      },
    });
  }

  logger.log(`Starting HTTP server on 0.0.0.0:${port}.`, 'Bootstrap');
  const server = await app.listen(port, '0.0.0.0');
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;

  logger.log('==========================================================', 'Bootstrap');
  logger.log(`The Simbolo Backend is running on: http://localhost:${actualPort}/${prefix}/v${version}`, 'Bootstrap');
  if (swaggerEnabled) {
    logger.log(`Swagger documentation is accessible at: http://localhost:${actualPort}/docs`, 'Bootstrap');
  }
  logger.log(`WebSocket Chat Gateway: ws://localhost:${actualPort}/chat`, 'Bootstrap');
  logger.log(`HTTP server listening on 0.0.0.0:${actualPort}`, 'Bootstrap');
  logger.log('==========================================================', 'Bootstrap');
}

function resolveListenPort(configuredPort: number, isProduction: boolean): number {
  if (process.env.PORT) {
    return Number(process.env.PORT);
  }

  if (isProduction) {
    return 3000;
  }

  return configuredPort;
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

bootstrap().catch((err) => {
  console.error('Fatal error during application bootstrap:', err);
  process.exit(1);
});

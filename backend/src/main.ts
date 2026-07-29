import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CustomLoggerService } from './shared/logger/logger.service';
import { RedisIoAdapter } from './realtime/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3001);
  const prefix = configService.get<string>('app.prefix', 'api');
  const version = configService.get<string>('app.version', '1').replace(/^v/i, '');
  const frontendUrls = configService.get<string[]>('app.frontendUrls', ['http://localhost:3000']);
  const isProduction = configService.get<string>('app.nodeEnv') === 'production';

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  // Response compression
  app.use(compression());
  app.use(cookieParser(process.env.COOKIE_SECRET || process.env.JWT_SECRET));

  // CORS configuration
  app.enableCors({
    origin: frontendUrls,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, x-request-id',
  });

  // WebSocket adapter (Socket.IO) with optional Redis adapter for horizontal scaling
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Global prefix & URI Versioning
  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version,
  });

  // Swagger OpenAPI Documentation Configuration
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
    // Phase 8 tags
    .addTag('Payments', 'Razorpay payment gateway integration — order creation and HMAC signature verification')
    .addTag('Transactions', 'Immutable financial ledger and revenue analytics')
    .addTag('Webhooks', 'Secure inbound gateway webhook processing with signature validation')
    .addTag('Invoices', 'Invoice lifecycle — generation, PDF download, email dispatch, status management')
    .addTag('Subscriptions', 'Recurring billing management — pause, resume, upgrade, cancel, renewal reminders')
    .addTag('Notifications', 'In-app and email notification center with preference management')
    .addTag('Chat', 'Real-time project messaging via Socket.IO with REST fallback')
    .addTag('Comments', 'Threaded comments on tasks and project entities')
    .addTag('Activity', 'Activity feed and Timeline event tracking')
    // Phase 9 tags
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

  await app.listen(port);
  logger.log(`==========================================================`, 'Bootstrap');
  logger.log(`🚀 The Simbolo Backend is running on: http://localhost:${port}/${prefix}/v${version}`, 'Bootstrap');
  logger.log(`📚 Swagger Documentation accessible at: http://localhost:${port}/docs`, 'Bootstrap');
  logger.log(`🔌 WebSocket Chat Gateway: ws://localhost:${port}/chat`, 'Bootstrap');
  logger.log(`==========================================================`, 'Bootstrap');
}

bootstrap().catch((err) => {
  console.error('Fatal error during application bootstrap:', err);
  process.exit(1);
});

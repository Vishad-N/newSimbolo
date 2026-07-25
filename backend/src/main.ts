import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { CustomLoggerService } from './shared/logger/logger.service';

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

  // Security headers
  app.use(helmet());

  // Response compression
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: frontendUrls,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, x-request-id',
  });

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
  logger.log(`==========================================================`, 'Bootstrap');
}

bootstrap().catch((err) => {
  console.error('Fatal error during application bootstrap:', err);
  process.exit(1);
});

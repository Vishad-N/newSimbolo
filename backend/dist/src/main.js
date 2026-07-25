"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
const logger_service_1 = require("./shared/logger/logger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const logger = app.get(logger_service_1.CustomLoggerService);
    app.useLogger(logger);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('app.port', 3001);
    const prefix = configService.get('app.prefix', 'api');
    const version = configService.get('app.version', '1').replace(/^v/i, '');
    const frontendUrls = configService.get('app.frontendUrls', ['http://localhost:3000']);
    // Security headers
    app.use((0, helmet_1.default)());
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
        type: common_1.VersioningType.URI,
        defaultVersion: version,
    });
    // Swagger OpenAPI Documentation Configuration
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('The Simbolo API')
        .setDescription('Enterprise-grade AI-powered Digital Marketing Platform API serving Landing Website, Client Dashboard, and Admin CMS.')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT bearer token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Health', 'Real-time system health and database connectivity diagnostics')
        .addTag('Users', 'User identity and profile management foundation')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document, {
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
//# sourceMappingURL=main.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
const logger_service_1 = require("./shared/logger/logger.service");
const redis_io_adapter_1 = require("./realtime/redis-io.adapter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        rawBody: true,
    });
    const logger = app.get(logger_service_1.CustomLoggerService);
    app.useLogger(logger);
    const configService = app.get(config_1.ConfigService);
    const port = Number(process.env.PORT || configService.get('app.port', 3000));
    const prefix = configService.get('app.prefix', 'api');
    const version = configService.get('app.version', '1').replace(/^v/i, '');
    const frontendUrls = configService.get('app.frontendUrls', ['http://localhost:3000']);
    const isProduction = configService.get('app.nodeEnv') === 'production';
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
    app.getHttpAdapter().get('/health/live', (_req, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
    });
    logger.log('Trust proxy enabled for reverse proxy compatibility.', 'Bootstrap');
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: isProduction ? undefined : false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        referrerPolicy: { policy: 'no-referrer' },
    }));
    app.use(compression());
    app.use(cookieParser(process.env.COOKIE_SECRET || process.env.JWT_SECRET));
    app.enableCors({
        origin: (origin, callback) => {
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
    const redisIoAdapter = new redis_io_adapter_1.RedisIoAdapter(app);
    try {
        await redisIoAdapter.connectToRedis();
        app.useWebSocketAdapter(redisIoAdapter);
    }
    catch {
        logger.warn('Failed to connect to Redis for WebSockets. Falling back to default adapter.', 'Bootstrap');
    }
    app.setGlobalPrefix(prefix);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: version,
    });
    const swaggerEnabled = !isProduction || process.env.SWAGGER_ENABLED === 'true';
    if (swaggerEnabled) {
        const { DocumentBuilder, SwaggerModule } = await Promise.resolve().then(() => require('@nestjs/swagger'));
        const swaggerConfig = new DocumentBuilder()
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
    const server = await app.listen(port, '0.0.0.0');
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    logger.log('==========================================================', 'Bootstrap');
    logger.log(`The Simbolo Backend is running on: http://localhost:${actualPort}/${prefix}/v${version}`, 'Bootstrap');
    if (swaggerEnabled) {
        logger.log(`Swagger documentation is accessible at: http://localhost:${actualPort}/docs`, 'Bootstrap');
    }
    logger.log(`WebSocket Chat Gateway: ws://localhost:${actualPort}/chat`, 'Bootstrap');
    logger.log(`System successfully bound to 0.0.0.0 on port ${actualPort}`, 'Bootstrap');
    logger.log('==========================================================', 'Bootstrap');
}
bootstrap().catch((err) => {
    console.error('Fatal error during application bootstrap:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map
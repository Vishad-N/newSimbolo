"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../common/decorators/public.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
const queue_service_1 = require("../queues/queue.service");
const sentry_service_1 = require("../observability/sentry.service");
const config_1 = require("@nestjs/config");
let HealthController = class HealthController {
    prisma;
    cacheService;
    queueService;
    sentryService;
    configService;
    constructor(prisma, cacheService, queueService, sentryService, configService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
        this.queueService = queueService;
        this.sentryService = sentryService;
        this.configService = configService;
    }
    async checkHealth() {
        const database = await this.checkDatabase();
        const redis = await this.cacheService.ping();
        const queues = await this.queueService.getHealth();
        return {
            status: database === 'up' ? 'ok' : 'degraded',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: { status: database },
            redis: { status: redis },
            queues,
            observability: { sentry: this.sentryService.status() },
        };
    }
    live() {
        return { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
    }
    async ready() {
        const [database, redis, queues] = await Promise.all([
            this.checkDatabase(),
            this.cacheService.ping(),
            this.queueService.getHealth(),
        ]);
        const requiredOk = database === 'up' && redis !== 'down' && queues.status !== 'down';
        return {
            status: requiredOk ? 'ready' : 'not_ready',
            database: { status: database },
            redis: { status: redis },
            queues,
            storage: {
                provider: this.configService.get('storage.provider'),
                status: this.configService.get('storage.bucket') ? 'configured' : 'missing_config',
            },
            email: {
                status: this.configService.get('email.host') ? 'configured' : 'mock_or_missing_config',
            },
            paymentGateway: {
                razorpay: this.configService.get('razorpay.keyId') ? 'configured' : 'mock_or_missing_config',
            },
            aiProvider: { status: 'mock' },
        };
    }
    async checkDatabase() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return 'up';
        }
        catch {
            return 'unreachable';
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check real-time application and database health' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'System health diagnostics payload',
        schema: {
            example: {
                status: 'ok',
                uptime: 124.5,
                timestamp: '2026-07-25T12:00:00.000Z',
                database: { status: 'up' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkHealth", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Container liveness probe' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "live", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('ready'),
    (0, swagger_1.ApiOperation)({ summary: 'Container readiness probe with dependency checks' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ready", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService,
        queue_service_1.QueueService,
        sentry_service_1.SentryService,
        config_1.ConfigService])
], HealthController);
//# sourceMappingURL=health.controller.js.map
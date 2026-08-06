import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { QueueService } from '../queues/queue.service';
import { SentryService } from '../observability/sentry.service';
import { ConfigService } from '@nestjs/config';
export declare class HealthController {
    private readonly prisma;
    private readonly cacheService;
    private readonly queueService;
    private readonly sentryService;
    private readonly configService;
    constructor(prisma: PrismaService, cacheService: CacheService, queueService: QueueService, sentryService: SentryService, configService: ConfigService);
    checkHealth(): Promise<{
        status: string;
        uptime: number;
        timestamp: string;
        database: {
            status: "up" | "unreachable";
        };
        redis: {
            status: "disabled" | "up" | "down";
        };
        queues: {
            status: string;
            queues: any[];
        };
        observability: {
            sentry: string;
        };
    }>;
    live(): {
        status: string;
        uptime: number;
        timestamp: string;
    };
    ready(): Promise<{
        status: string;
        database: {
            status: "up" | "unreachable";
        };
        redis: {
            status: "disabled" | "up" | "down";
        };
        queues: {
            status: string;
            queues: any[];
        };
        storage: {
            provider: string | undefined;
            status: string;
        };
        email: {
            status: string;
        };
        paymentGateway: {
            razorpay: string;
        };
        aiProvider: {
            status: string;
        };
    }>;
    private checkDatabase;
}

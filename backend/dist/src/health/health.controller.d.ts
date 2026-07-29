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
            status: "up" | "disabled" | "down";
        };
        queues: {
            status: string;
            queues: {
                name: import("../queues/queue.service").QueueName;
                waiting: number;
                active: number;
                failed: number;
            }[];
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
            status: "up" | "disabled" | "down";
        };
        queues: {
            status: string;
            queues: {
                name: import("../queues/queue.service").QueueName;
                waiting: number;
                active: number;
                failed: number;
            }[];
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

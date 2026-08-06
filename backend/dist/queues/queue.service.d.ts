import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { BaseService } from '../shared/abstractions/base.service';
export type QueueName = 'email' | 'invoice-pdf' | 'ai' | 'analytics' | 'exports' | 'images' | 'notifications' | 'reminders';
export declare class QueueService extends BaseService implements OnModuleDestroy {
    private readonly configService;
    private readonly connection?;
    private readonly queues;
    private readonly workers;
    private readonly deadLetterQueue?;
    private lastQueueCountsTime;
    private lastQueueCounts;
    constructor(configService: ConfigService);
    onModuleDestroy(): Promise<void>;
    add<T extends Record<string, unknown>>(queueName: QueueName, name: string, data: T): Promise<{
        queued: boolean;
        queueName: QueueName;
        name: string;
        jobId?: undefined;
    } | {
        queued: boolean;
        queueName: QueueName;
        jobId: string | undefined;
        name?: undefined;
    }>;
    registerWorker<T extends Record<string, unknown>>(queueName: QueueName, processor: (job: Job<T>) => Promise<void>): void;
    getHealth(): Promise<{
        status: string;
        queues: any[];
    }>;
    private getQueue;
}

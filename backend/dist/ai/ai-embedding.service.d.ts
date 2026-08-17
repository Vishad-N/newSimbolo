import { OnModuleInit } from '@nestjs/common';
import { QueueService } from '../queues/queue.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
interface EmbeddingJob extends Record<string, unknown> {
    entityType: 'Service' | 'Package' | 'User' | 'Blog' | 'CaseStudy' | 'Testimonial';
    entityId: string;
    textToEmbed: string;
}
export declare class AiEmbeddingService implements OnModuleInit {
    private readonly queueService;
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private readonly genAI;
    private readonly embeddingModel;
    constructor(queueService: QueueService, prisma: PrismaService, configService: ConfigService);
    onModuleInit(): void;
    queueEmbeddingGeneration(entityType: EmbeddingJob['entityType'], entityId: string, textToEmbed: string): Promise<{
        queued: boolean;
        queueName: import("../queues/queue.service").QueueName;
        name: string;
        jobId?: undefined;
    } | {
        queued: boolean;
        queueName: import("../queues/queue.service").QueueName;
        jobId: string | undefined;
        name?: undefined;
    }>;
    getEmbedding(text: string): Promise<number[]>;
    private processEmbeddingJob;
}
export {};

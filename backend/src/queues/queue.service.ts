import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, JobsOptions, Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { BaseService } from '../shared/abstractions/base.service';

export type QueueName =
  | 'email'
  | 'invoice-pdf'
  | 'ai'
  | 'analytics'
  | 'exports'
  | 'images'
  | 'notifications'
  | 'reminders'
  | 'commissions';

@Injectable()
export class QueueService extends BaseService implements OnModuleDestroy {
  private readonly connection?: Redis;
  private readonly queues = new Map<QueueName, Queue>();
  private readonly workers = new Map<QueueName, Worker>();
  private readonly deadLetterQueue?: Queue;
  private lastQueueCountsTime = 0;
  private lastQueueCounts: any[] = [];

  constructor(private readonly configService: ConfigService) {
    super('QueueService');
    const redisUrl = this.configService.get<string>('redis.url');
    if (!redisUrl) {
      this.logger.warn('BullMQ disabled because REDIS_URL is not configured');
      return;
    }
    this.connection = new Redis(redisUrl, { maxRetriesPerRequest: null });
    this.deadLetterQueue = new Queue('dead-letter', { connection: this.connection });
  }

  async onModuleDestroy() {
    await Promise.all(Array.from(this.workers.values()).map((worker) => worker.close()));
    await Promise.all(Array.from(this.queues.values()).map((queue) => queue.close()));
    await this.deadLetterQueue?.close();
    await this.connection?.quit();
  }

  async add<T extends Record<string, unknown>>(queueName: QueueName, name: string, data: T, opts?: JobsOptions) {
    const queue = this.getQueue(queueName);
    if (!queue) return { queued: false, queueName, name };
    const job = await queue.add(name, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: false,
      ...opts,
    });
    return { queued: true, queueName, jobId: job.id };
  }

  registerWorker<T extends Record<string, unknown>>(queueName: QueueName, processor: (job: Job<T>) => Promise<void>) {
    if (!this.connection || this.workers.has(queueName)) return;
    const worker = new Worker<T>(queueName, async (job) => processor(job), {
      connection: this.connection,
      concurrency: 5,
      stalledInterval: 300000,
      drainDelay: 300,
    });
    worker.on('failed', async (job, error) => {
      this.logger.error(`Job failed: ${queueName}/${job?.name} - ${error.message}`, error.stack);
      if (job && this.deadLetterQueue) {
        await this.deadLetterQueue.add(`${queueName}:${job.name}`, {
          id: job.id,
          data: job.data,
          failedReason: error.message,
        });
      }
    });
    this.workers.set(queueName, worker);
  }

  async getHealth() {
    if (!this.connection) return { status: 'disabled', queues: [] };
    try {
      await this.connection.ping();

      const now = Date.now();
      if (now - this.lastQueueCountsTime > 60000) {
        this.lastQueueCounts = await Promise.all(
          Array.from(this.queues.entries()).map(async ([name, queue]) => ({
            name,
            waiting: await queue.getWaitingCount(),
            active: await queue.getActiveCount(),
            failed: await queue.getFailedCount(),
          })),
        );
        this.lastQueueCountsTime = now;
      }

      return { status: 'up', queues: this.lastQueueCounts };
    } catch {
      return { status: 'down', queues: [] };
    }
  }

  private getQueue(queueName: QueueName): Queue | null {
    if (!this.connection) return null;
    const existing = this.queues.get(queueName);
    if (existing) return existing;
    const queue = new Queue(queueName, { connection: this.connection });
    this.queues.set(queueName, queue);
    return queue;
  }
}

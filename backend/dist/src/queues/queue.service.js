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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const base_service_1 = require("../shared/abstractions/base.service");
let QueueService = class QueueService extends base_service_1.BaseService {
    configService;
    connection;
    queues = new Map();
    workers = new Map();
    deadLetterQueue;
    constructor(configService) {
        super('QueueService');
        this.configService = configService;
        const redisUrl = this.configService.get('redis.url');
        if (!redisUrl) {
            this.logger.warn('BullMQ disabled because REDIS_URL is not configured');
            return;
        }
        this.connection = new ioredis_1.default(redisUrl, { maxRetriesPerRequest: null });
        this.deadLetterQueue = new bullmq_1.Queue('dead-letter', { connection: this.connection });
    }
    async onModuleDestroy() {
        await Promise.all(Array.from(this.workers.values()).map((worker) => worker.close()));
        await Promise.all(Array.from(this.queues.values()).map((queue) => queue.close()));
        await this.deadLetterQueue?.close();
        await this.connection?.quit();
    }
    async add(queueName, name, data) {
        const queue = this.getQueue(queueName);
        if (!queue)
            return { queued: false, queueName, name };
        const job = await queue.add(name, data, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: 100,
            removeOnFail: false,
        });
        return { queued: true, queueName, jobId: job.id };
    }
    registerWorker(queueName, processor) {
        if (!this.connection || this.workers.has(queueName))
            return;
        const worker = new bullmq_1.Worker(queueName, async (job) => processor(job), {
            connection: this.connection,
            concurrency: 5,
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
        if (!this.connection)
            return { status: 'disabled', queues: [] };
        try {
            await this.connection.ping();
            const queues = await Promise.all(Array.from(this.queues.entries()).map(async ([name, queue]) => ({
                name,
                waiting: await queue.getWaitingCount(),
                active: await queue.getActiveCount(),
                failed: await queue.getFailedCount(),
            })));
            return { status: 'up', queues };
        }
        catch {
            return { status: 'down', queues: [] };
        }
    }
    getQueue(queueName) {
        if (!this.connection)
            return null;
        const existing = this.queues.get(queueName);
        if (existing)
            return existing;
        const queue = new bullmq_1.Queue(queueName, { connection: this.connection });
        this.queues.set(queueName, queue);
        return queue;
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QueueService);
//# sourceMappingURL=queue.service.js.map
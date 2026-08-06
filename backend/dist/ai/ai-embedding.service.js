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
var AiEmbeddingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiEmbeddingService = void 0;
const common_1 = require("@nestjs/common");
const queue_service_1 = require("../queues/queue.service");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let AiEmbeddingService = AiEmbeddingService_1 = class AiEmbeddingService {
    queueService;
    prisma;
    configService;
    logger = new common_1.Logger(AiEmbeddingService_1.name);
    genAI;
    constructor(queueService, prisma, configService) {
        this.queueService = queueService;
        this.prisma = prisma;
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY') || '';
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    onModuleInit() {
        this.queueService.registerWorker('ai', async (job) => {
            await this.processEmbeddingJob(job.data);
        });
    }
    async queueEmbeddingGeneration(entityType, entityId, textToEmbed) {
        return this.queueService.add('ai', `embed-${entityType}-${entityId}`, {
            entityType,
            entityId,
            textToEmbed
        });
    }
    async getEmbedding(text) {
        const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }
    async processEmbeddingJob(data) {
        this.logger.log(`Generating embedding for ${data.entityType} ${data.entityId}`);
        try {
            const embedding = await this.getEmbedding(data.textToEmbed);
            const tableNameMap = {
                'Service': 'Service',
                'Package': 'Package',
                'User': 'User',
                'Blog': 'Blog',
                'CaseStudy': 'CaseStudy',
                'Testimonial': 'Testimonial',
            };
            const tableName = tableNameMap[data.entityType];
            if (!tableName)
                throw new Error(`Unknown entity type ${data.entityType}`);
            const vectorString = `[${embedding.join(',')}]`;
            await this.prisma.$executeRawUnsafe(`UPDATE "${tableName}" SET embedding = $1::vector WHERE id = $2`, vectorString, data.entityId);
            this.logger.log(`Successfully embedded ${data.entityType} ${data.entityId}`);
        }
        catch (error) {
            this.logger.error(`Failed to generate embedding for ${data.entityType} ${data.entityId}: ${error.message}`);
            throw error;
        }
    }
};
exports.AiEmbeddingService = AiEmbeddingService;
exports.AiEmbeddingService = AiEmbeddingService = AiEmbeddingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [queue_service_1.QueueService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], AiEmbeddingService);
//# sourceMappingURL=ai-embedding.service.js.map
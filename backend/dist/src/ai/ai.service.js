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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const gemini_provider_1 = require("./providers/gemini.provider");
const prisma_service_1 = require("../prisma/prisma.service");
const search_prompt_1 = require("./prompts/search.prompt");
const cache_service_1 = require("../cache/cache.service");
const ai_embedding_service_1 = require("./ai-embedding.service");
let AiService = class AiService extends base_service_1.BaseService {
    provider;
    prisma;
    cacheService;
    embeddingService;
    constructor(provider, prisma, cacheService, embeddingService) {
        super('AiService');
        this.provider = provider;
        this.prisma = prisma;
        this.cacheService = cacheService;
        this.embeddingService = embeddingService;
    }
    getCapabilities() {
        return {
            provider: 'Gemini',
            capabilities: [
                'AI Search',
                'Generate Blog Drafts',
                'Improve Existing Content',
                'SEO Recommendations',
            ],
        };
    }
    generate(dto) {
        // Legacy generation endpoint placeholder
        return { message: "Generation not implemented with Gemini yet." };
    }
    async search(dto) {
        const query = dto.query.toLowerCase();
        const cacheKey = `ai:search:${query}`;
        // 1. Check Redis Cache
        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
            this.logger.log(`Cache hit for query: ${query}`);
            return cached;
        }
        this.logger.log(`Cache miss for query: ${query}. Performing hybrid search...`);
        let queryEmbedding = [];
        try {
            // 2. Generate Embedding for Query
            queryEmbedding = await this.embeddingService.getEmbedding(query);
        }
        catch (e) {
            this.logger.warn(`Failed to generate embedding for query: ${query}. Falling back to keyword search only.`);
        }
        let services = [];
        let packages = [];
        const keywordPattern = `%${query}%`;
        if (queryEmbedding.length > 0) {
            const vectorString = `[${queryEmbedding.join(',')}]`;
            // 3. Hybrid Search Services
            services = await this.prisma.$queryRawUnsafe(`
        SELECT id, name, "shortDescription",
        COALESCE(1 - (embedding <=> $1::vector), 0) as similarity,
        (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) as keyword_score
        FROM "Service"
        ORDER BY COALESCE(1 - (embedding <=> $1::vector), 0) + (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) DESC
        LIMIT 5
      `, vectorString, keywordPattern);
            // 4. Hybrid Search Packages
            packages = await this.prisma.$queryRawUnsafe(`
        SELECT id, name, description,
        COALESCE(1 - (embedding <=> $1::vector), 0) as similarity,
        (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) as keyword_score
        FROM "Package"
        ORDER BY COALESCE(1 - (embedding <=> $1::vector), 0) + (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) DESC
        LIMIT 5
      `, vectorString, keywordPattern);
        }
        else {
            // Fallback to purely keyword if embedding fails
            services = await this.prisma.$queryRawUnsafe(`
        SELECT id, name, "shortDescription",
        0 as similarity,
        (CASE WHEN name ILIKE $1 THEN 0.5 ELSE 0 END) as keyword_score
        FROM "Service"
        WHERE name ILIKE $1 OR "shortDescription" ILIKE $1
        ORDER BY keyword_score DESC
        LIMIT 5
      `, keywordPattern);
            packages = await this.prisma.$queryRawUnsafe(`
        SELECT id, name, description,
        0 as similarity,
        (CASE WHEN name ILIKE $1 THEN 0.5 ELSE 0 END) as keyword_score
        FROM "Package"
        WHERE name ILIKE $1 OR description ILIKE $1
        ORDER BY keyword_score DESC
        LIMIT 5
      `, keywordPattern);
        }
        // 5. Experts
        const experts = await this.prisma.user.findMany({
            where: {
                role: {
                    name: { in: ['CONTENT_MANAGER', 'PROJECT_MANAGER', 'MARKETING_MANAGER', 'ADMIN'] }
                }
            },
            take: 10,
        });
        const contextExperts = experts.map(e => ({
            id: e.id,
            name: `${e.firstName} ${e.lastName}`,
            title: 'Digital Marketing Expert',
            imageUrl: e.avatarUrl || `https://i.pravatar.cc/150?u=${e.id}`
        }));
        // 6. Gemini Generation
        const prompt = (0, search_prompt_1.buildSearchPrompt)(query, {
            services,
            packages,
            experts: contextExperts,
            reviews: [],
        });
        const result = await this.provider.search(prompt);
        // 7. Store in Cache (TTL 1 hour = 3600 seconds)
        await this.cacheService.set(cacheKey, result, 3600);
        return result;
    }
    async triggerInitialEmbeddingSync() {
        let queued = 0;
        const services = await this.prisma.service.findMany();
        for (const service of services) {
            await this.embeddingService.queueEmbeddingGeneration('Service', service.id, `${service.name} ${service.shortDescription || ''}`);
            queued++;
        }
        const packages = await this.prisma.package.findMany();
        for (const pkg of packages) {
            await this.embeddingService.queueEmbeddingGeneration('Package', pkg.id, `${pkg.name} ${pkg.description || ''}`);
            queued++;
        }
        return { message: `Queued ${queued} items for embedding generation.` };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_provider_1.GeminiProvider,
        prisma_service_1.PrismaService,
        cache_service_1.CacheService,
        ai_embedding_service_1.AiEmbeddingService])
], AiService);
//# sourceMappingURL=ai.service.js.map
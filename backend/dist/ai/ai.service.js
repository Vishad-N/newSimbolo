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
            capabilities: ['AI Search', 'Generate Blog Drafts', 'Improve Existing Content', 'SEO Recommendations'],
        };
    }
    generate(dto) {
        // Legacy generation endpoint placeholder
        return { message: 'Generation not implemented with Gemini yet.' };
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
        // 2. Everything below is independent until the catalog queries need the
        // embedding vector, so run it all concurrently instead of one round trip
        // at a time — this alone removes 3 sequential DB/network round trips.
        const [queryEmbedding, hasServicesTable, hasPackagesTable, experts] = await Promise.all([
            this.embeddingService.getEmbedding(query).catch(() => {
                this.logger.warn(`Failed to generate embedding for query: ${query}. Falling back to keyword search only.`);
                return [];
            }),
            this.tableExists('services'),
            this.tableExists('packages'),
            this.prisma.user.findMany({
                where: { role: { name: { in: ['CONTENT_MANAGER', 'PROJECT_MANAGER', 'MARKETING_MANAGER', 'ADMIN'] } } },
                take: 10,
            }),
        ]);
        if (!hasServicesTable) {
            this.logger.warn('AI search skipped services lookup because table "services" does not exist.');
        }
        if (!hasPackagesTable) {
            this.logger.warn('AI search skipped packages lookup because table "packages" does not exist.');
        }
        const keywordPattern = `%${query}%`;
        let services = [];
        let packages = [];
        const catalogFetches = [];
        if (queryEmbedding.length > 0) {
            const vectorString = `[${queryEmbedding.join(',')}]`;
            if (hasServicesTable) {
                catalogFetches.push(this.queryCatalogTable(`
          SELECT id, name, "shortDescription",
          COALESCE(1 - (embedding <=> $1::vector), 0) as similarity,
          (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "services"
          ORDER BY COALESCE(1 - (embedding <=> $1::vector), 0) + (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) DESC
          LIMIT 5
        `, [vectorString, keywordPattern], 'services').then((rows) => {
                    services = rows;
                }));
            }
            if (hasPackagesTable) {
                catalogFetches.push(this.queryCatalogTable(`
          SELECT id, name, description,
          COALESCE(1 - (embedding <=> $1::vector), 0) as similarity,
          (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "packages"
          ORDER BY COALESCE(1 - (embedding <=> $1::vector), 0) + (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) DESC
          LIMIT 5
        `, [vectorString, keywordPattern], 'packages').then((rows) => {
                    packages = rows;
                }));
            }
        }
        else {
            // Fallback to purely keyword if embedding fails
            if (hasServicesTable) {
                catalogFetches.push(this.queryCatalogTable(`
          SELECT id, name, "shortDescription",
          0 as similarity,
          (CASE WHEN name ILIKE $1 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "services"
          WHERE name ILIKE $1 OR "shortDescription" ILIKE $1
          ORDER BY keyword_score DESC
          LIMIT 5
        `, [keywordPattern], 'services').then((rows) => {
                    services = rows;
                }));
            }
            if (hasPackagesTable) {
                catalogFetches.push(this.queryCatalogTable(`
          SELECT id, name, description,
          0 as similarity,
          (CASE WHEN name ILIKE $1 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "packages"
          WHERE name ILIKE $1 OR description ILIKE $1
          ORDER BY keyword_score DESC
          LIMIT 5
        `, [keywordPattern], 'packages').then((rows) => {
                    packages = rows;
                }));
            }
        }
        await Promise.all(catalogFetches);
        const contextExperts = experts.map((e) => ({
            id: e.id,
            name: `${e.firstName} ${e.lastName}`,
            title: 'Digital Marketing Expert',
            imageUrl: e.avatarUrl || `https://i.pravatar.cc/150?u=${e.id}`,
        }));
        // 3. Gemini Generation — only asked for the parts that genuinely need
        // reasoning (summary/matchPercentage/recommendedService/recommendedPackage/
        // suggestions). Experts and relatedServices are data we already have, so
        // they're assembled deterministically below instead of round-tripped
        // through the model as structured JSON, which cuts generation time.
        const prompt = (0, search_prompt_1.buildSearchPrompt)(query, { services, packages });
        let result;
        try {
            const llmResult = await this.provider.search(prompt);
            result = {
                ...llmResult,
                experts: this.toExpertList(contextExperts),
                reviews: [],
                relatedServices: this.toRelatedServices(services),
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown Gemini search error';
            this.logger.warn(`Gemini search failed. Returning deterministic fallback response. ${message}`);
            result = this.buildFallbackSearchResponse(query, services, packages, contextExperts);
        }
        // 4. Store in Cache (TTL 1 hour = 3600 seconds)
        await this.cacheService.set(cacheKey, result, 3600);
        return result;
    }
    toExpertList(contextExperts) {
        return contextExperts.slice(0, 3).map((expert) => ({
            ...expert,
            rating: 4.8,
            projectsCompleted: 0,
            specialization: 'Digital marketing',
            responseTime: 'Within 24 hours',
            hourlyPrice: 0,
            isSimboloExpert: true,
            skills: ['SEO', 'Strategy', 'Content'],
            experience: 'Verified Simbolo expert',
            availability: 'Available',
        }));
    }
    toRelatedServices(services) {
        return services.slice(0, 3).map((service) => ({
            id: service.id,
            title: service.name,
            description: service.shortDescription || '',
            icon: 'search',
        }));
    }
    async tableExists(tableName) {
        const result = await this.prisma.$queryRawUnsafe('SELECT to_regclass($1) IS NOT NULL AS "exists"', tableName);
        return result[0]?.exists ?? false;
    }
    async queryCatalogTable(query, params, tableName) {
        try {
            return await this.prisma.$queryRawUnsafe(query, ...params);
        }
        catch (error) {
            if (this.isMissingRelationError(error)) {
                this.logger.warn(`AI search skipped ${tableName} lookup because table "${tableName}" does not exist.`);
                return [];
            }
            throw error;
        }
    }
    isMissingRelationError(error) {
        if (!error || typeof error !== 'object')
            return false;
        const record = error;
        return record.code === '42P01' || record.meta?.code === '42P01' || record.message?.includes('42P01') === true;
    }
    buildFallbackSearchResponse(query, services, packages, experts) {
        const recommendedService = services[0]?.name || this.inferServiceName(query);
        const recommendedPackage = packages[0]?.name || 'Custom consultation';
        return {
            summary: `Based on your request, ${recommendedService} is the best starting point. Share your website URL, target locations, current traffic, and main goals so the team can scope the right SEO plan.`,
            matchPercentage: services.length > 0 || packages.length > 0 ? 82 : 65,
            recommendedService,
            recommendedPackage,
            experts: experts.map((expert) => ({
                ...expert,
                rating: 4.8,
                projectsCompleted: 0,
                specialization: 'Digital marketing',
                responseTime: 'Within 24 hours',
                hourlyPrice: 0,
                isSimboloExpert: true,
                skills: ['SEO', 'Strategy', 'Content'],
                experience: 'Verified Simbolo expert',
                availability: 'Available',
            })),
            suggestions: [
                { id: 'technical-seo', label: 'Technical SEO audit' },
                { id: 'keyword-strategy', label: 'Keyword strategy' },
                { id: 'local-seo', label: 'Local SEO' },
            ],
            reviews: [],
            relatedServices: services.map((service) => ({
                id: service.id,
                title: service.name,
                description: service.shortDescription || '',
                icon: 'search',
            })),
        };
    }
    inferServiceName(query) {
        if (query.includes('seo'))
            return 'SEO';
        if (query.includes('website') || query.includes('web'))
            return 'Website optimization';
        if (query.includes('social'))
            return 'Social media marketing';
        return 'Digital marketing strategy';
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
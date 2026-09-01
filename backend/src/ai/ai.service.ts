import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { GeminiProvider } from './providers/gemini.provider';
import { AiSearchDto } from './dto/ai-search.dto';
import { PrismaService } from '../prisma/prisma.service';
import { buildSearchPrompt } from './prompts/search.prompt';
import { AiGenerationDto } from './dto/ai.dto';
import { CacheService } from '../cache/cache.service';
import { AiEmbeddingService } from './ai-embedding.service';
import { Expert, LlmSearchResponse, SearchResponse, Service } from './interfaces/search-response.interface';

interface TablePresenceResult {
  exists: boolean;
}

@Injectable()
export class AiService extends BaseService {
  constructor(
    private readonly provider: GeminiProvider,
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly embeddingService: AiEmbeddingService,
  ) {
    super('AiService');
  }

  getCapabilities() {
    return {
      provider: 'Gemini',
      capabilities: ['AI Search', 'Generate Blog Drafts', 'Improve Existing Content', 'SEO Recommendations'],
    };
  }

  generate(dto: AiGenerationDto) {
    // Legacy generation endpoint placeholder
    return { message: 'Generation not implemented with Gemini yet.' };
  }

  async search(dto: AiSearchDto) {
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
        return [] as number[];
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
    let services: any[] = [];
    let packages: any[] = [];

    const catalogFetches: Promise<void>[] = [];
    if (queryEmbedding.length > 0) {
      const vectorString = `[${queryEmbedding.join(',')}]`;

      if (hasServicesTable) {
        catalogFetches.push(
          this.queryCatalogTable<any>(
            `
          SELECT id, name, "shortDescription",
          COALESCE(1 - (embedding <=> $1::vector), 0) as similarity,
          (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "services"
          ORDER BY COALESCE(1 - (embedding <=> $1::vector), 0) + (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) DESC
          LIMIT 5
        `,
            [vectorString, keywordPattern],
            'services',
          ).then((rows) => {
            services = rows;
          }),
        );
      }

      if (hasPackagesTable) {
        catalogFetches.push(
          this.queryCatalogTable<any>(
            `
          SELECT id, name, description,
          COALESCE(1 - (embedding <=> $1::vector), 0) as similarity,
          (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "packages"
          ORDER BY COALESCE(1 - (embedding <=> $1::vector), 0) + (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) DESC
          LIMIT 5
        `,
            [vectorString, keywordPattern],
            'packages',
          ).then((rows) => {
            packages = rows;
          }),
        );
      }
    } else {
      // Fallback to purely keyword if embedding fails
      if (hasServicesTable) {
        catalogFetches.push(
          this.queryCatalogTable<any>(
            `
          SELECT id, name, "shortDescription",
          0 as similarity,
          (CASE WHEN name ILIKE $1 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "services"
          WHERE name ILIKE $1 OR "shortDescription" ILIKE $1
          ORDER BY keyword_score DESC
          LIMIT 5
        `,
            [keywordPattern],
            'services',
          ).then((rows) => {
            services = rows;
          }),
        );
      }

      if (hasPackagesTable) {
        catalogFetches.push(
          this.queryCatalogTable<any>(
            `
          SELECT id, name, description,
          0 as similarity,
          (CASE WHEN name ILIKE $1 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "packages"
          WHERE name ILIKE $1 OR description ILIKE $1
          ORDER BY keyword_score DESC
          LIMIT 5
        `,
            [keywordPattern],
            'packages',
          ).then((rows) => {
            packages = rows;
          }),
        );
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
    const prompt = buildSearchPrompt(query, { services, packages });

    let result: SearchResponse;
    try {
      const llmResult = await this.provider.search(prompt);
      result = {
        ...llmResult,
        experts: this.toExpertList(contextExperts),
        reviews: [],
        relatedServices: this.toRelatedServices(services),
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown Gemini search error';
      this.logger.warn(`Gemini search failed. Returning deterministic fallback response. ${message}`);
      result = this.buildFallbackSearchResponse(query, services, packages, contextExperts);
    }

    // 4. Store in Cache (TTL 1 hour = 3600 seconds)
    await this.cacheService.set(cacheKey, result, 3600);

    return result;
  }

  private toExpertList(contextExperts: Array<{ id: string; name: string; title: string; imageUrl: string }>): Expert[] {
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

  private toRelatedServices(services: Array<{ id: string; name: string; shortDescription?: string | null }>): Service[] {
    return services.slice(0, 3).map((service) => ({
      id: service.id,
      title: service.name,
      description: service.shortDescription || '',
      icon: 'search',
    }));
  }

  private async tableExists(tableName: string): Promise<boolean> {
    const result = await this.prisma.$queryRawUnsafe<TablePresenceResult[]>(
      'SELECT to_regclass($1) IS NOT NULL AS "exists"',
      tableName,
    );
    return result[0]?.exists ?? false;
  }

  private async queryCatalogTable<T>(query: string, params: unknown[], tableName: string): Promise<T[]> {
    try {
      return await this.prisma.$queryRawUnsafe<T[]>(query, ...params);
    } catch (error: unknown) {
      if (this.isMissingRelationError(error)) {
        this.logger.warn(`AI search skipped ${tableName} lookup because table "${tableName}" does not exist.`);
        return [];
      }
      throw error;
    }
  }

  private isMissingRelationError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const record = error as { code?: string; meta?: { code?: string; message?: string }; message?: string };
    return record.code === '42P01' || record.meta?.code === '42P01' || record.message?.includes('42P01') === true;
  }

  private buildFallbackSearchResponse(
    query: string,
    services: Array<{ id: string; name: string; shortDescription?: string | null }>,
    packages: Array<{ id: string; name: string; description?: string | null }>,
    experts: Array<{ id: string; name: string; title: string; imageUrl: string }>,
  ): SearchResponse {
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

  private inferServiceName(query: string): string {
    if (query.includes('seo')) return 'SEO';
    if (query.includes('website') || query.includes('web')) return 'Website optimization';
    if (query.includes('social')) return 'Social media marketing';
    return 'Digital marketing strategy';
  }

  async triggerInitialEmbeddingSync() {
    let queued = 0;

    const services = await this.prisma.service.findMany();
    for (const service of services) {
      await this.embeddingService.queueEmbeddingGeneration(
        'Service',
        service.id,
        `${service.name} ${service.shortDescription || ''}`,
      );
      queued++;
    }

    const packages = await this.prisma.package.findMany();
    for (const pkg of packages) {
      await this.embeddingService.queueEmbeddingGeneration('Package', pkg.id, `${pkg.name} ${pkg.description || ''}`);
      queued++;
    }

    return { message: `Queued ${queued} items for embedding generation.` };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { GeminiProvider } from './providers/gemini.provider';
import { AiSearchDto } from './dto/ai-search.dto';
import { PrismaService } from '../prisma/prisma.service';
import { buildSearchPrompt } from './prompts/search.prompt';
import { AiGenerationDto } from './dto/ai.dto';
import { CacheService } from '../cache/cache.service';
import { AiEmbeddingService } from './ai-embedding.service';

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
      capabilities: [
        'AI Search',
        'Generate Blog Drafts',
        'Improve Existing Content',
        'SEO Recommendations',
      ],
    };
  }

  generate(dto: AiGenerationDto) {
    // Legacy generation endpoint placeholder
    return { message: "Generation not implemented with Gemini yet." };
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

    let queryEmbedding: number[] = [];
    try {
      // 2. Generate Embedding for Query
      queryEmbedding = await this.embeddingService.getEmbedding(query);
    } catch (e) {
      this.logger.warn(`Failed to generate embedding for query: ${query}. Falling back to keyword search only.`);
    }
    
    let services: any[] = [];
    let packages: any[] = [];

    const keywordPattern = `%${query}%`;
    const [hasServicesTable, hasPackagesTable] = await Promise.all([
      this.tableExists('services'),
      this.tableExists('packages'),
    ]);

    if (!hasServicesTable) {
      this.logger.warn('AI search skipped services lookup because table "services" does not exist.');
    }

    if (!hasPackagesTable) {
      this.logger.warn('AI search skipped packages lookup because table "packages" does not exist.');
    }

    if (queryEmbedding.length > 0) {
      const vectorString = `[${queryEmbedding.join(',')}]`;

      // 3. Hybrid Search Services
      if (hasServicesTable) {
        services = await this.queryCatalogTable<any>(`
          SELECT id, name, "shortDescription",
          COALESCE(1 - (embedding <=> $1::vector), 0) as similarity,
          (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "services"
          ORDER BY COALESCE(1 - (embedding <=> $1::vector), 0) + (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) DESC
          LIMIT 5
        `, [vectorString, keywordPattern], 'services');
      }

      // 4. Hybrid Search Packages
      if (hasPackagesTable) {
        packages = await this.queryCatalogTable<any>(`
          SELECT id, name, description,
          COALESCE(1 - (embedding <=> $1::vector), 0) as similarity,
          (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "packages"
          ORDER BY COALESCE(1 - (embedding <=> $1::vector), 0) + (CASE WHEN name ILIKE $2 THEN 0.5 ELSE 0 END) DESC
          LIMIT 5
        `, [vectorString, keywordPattern], 'packages');
      }
    } else {
      // Fallback to purely keyword if embedding fails
      if (hasServicesTable) {
        services = await this.queryCatalogTable<any>(`
          SELECT id, name, "shortDescription",
          0 as similarity,
          (CASE WHEN name ILIKE $1 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "services"
          WHERE name ILIKE $1 OR "shortDescription" ILIKE $1
          ORDER BY keyword_score DESC
          LIMIT 5
        `, [keywordPattern], 'services');
      }

      if (hasPackagesTable) {
        packages = await this.queryCatalogTable<any>(`
          SELECT id, name, description,
          0 as similarity,
          (CASE WHEN name ILIKE $1 THEN 0.5 ELSE 0 END) as keyword_score
          FROM "packages"
          WHERE name ILIKE $1 OR description ILIKE $1
          ORDER BY keyword_score DESC
          LIMIT 5
        `, [keywordPattern], 'packages');
      }
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
    const prompt = buildSearchPrompt(query, {
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
}

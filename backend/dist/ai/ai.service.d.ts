import { BaseService } from '../shared/abstractions/base.service';
import { GeminiProvider } from './providers/gemini.provider';
import { AiSearchDto } from './dto/ai-search.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AiGenerationDto } from './dto/ai.dto';
import { CacheService } from '../cache/cache.service';
import { AiEmbeddingService } from './ai-embedding.service';
export declare class AiService extends BaseService {
    private readonly provider;
    private readonly prisma;
    private readonly cacheService;
    private readonly embeddingService;
    constructor(provider: GeminiProvider, prisma: PrismaService, cacheService: CacheService, embeddingService: AiEmbeddingService);
    getCapabilities(): {
        provider: string;
        capabilities: string[];
    };
    generate(dto: AiGenerationDto): {
        message: string;
    };
    search(dto: AiSearchDto): Promise<{}>;
    private tableExists;
    private queryCatalogTable;
    private isMissingRelationError;
    private buildFallbackSearchResponse;
    private inferServiceName;
    triggerInitialEmbeddingSync(): Promise<{
        message: string;
    }>;
}

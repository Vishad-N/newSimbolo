import { ConfigService } from '@nestjs/config';
import { AIProvider } from './ai-provider.interface';
import { SearchResponse } from '../interfaces/search-response.interface';
export declare class GeminiProvider implements AIProvider {
    private readonly configService;
    private readonly logger;
    private genAI;
    constructor(configService: ConfigService);
    search(prompt: string): Promise<SearchResponse>;
    chat<T = any>(history: any[], prompt: string, schema?: any): Promise<T>;
    private getSchema;
}

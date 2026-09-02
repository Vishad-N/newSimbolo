import { ConfigService } from '@nestjs/config';
import { AIProvider } from './ai-provider.interface';
import { LlmSearchResponse } from '../interfaces/search-response.interface';
export declare class GeminiProvider implements AIProvider {
    private readonly configService;
    private readonly logger;
    private readonly genAI;
    private readonly generationModel;
    constructor(configService: ConfigService);
    search(prompt: string): Promise<LlmSearchResponse>;
    chat<T = any>(history: any[], prompt: string, schema?: any): Promise<T>;
    private getSchema;
}

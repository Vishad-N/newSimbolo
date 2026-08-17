import { BaseAgent } from './base.agent';
import { GeminiProvider } from '../../providers/gemini.provider';
import { SessionMemoryData } from '../conversation.memory';
import { AiService } from '../../ai.service';
import { SearchResponse } from '../../interfaces/search-response.interface';
export declare class SearchAgent extends BaseAgent {
    private readonly aiService;
    constructor(provider: GeminiProvider, aiService: AiService);
    get intentName(): string;
    process(message: string, session: SessionMemoryData, contextOverrides?: Record<string, any>): Promise<{
        response: string;
        data: SearchResponse;
        recommendations: string[];
    }>;
}

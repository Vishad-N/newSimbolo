import { AiService } from './ai.service';
import { AiGenerationDto } from './dto/ai.dto';
import { AiSearchDto } from './dto/ai-search.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getCapabilities(): {
        provider: string;
        capabilities: string[];
    };
    generate(dto: AiGenerationDto): {
        message: string;
    };
    search(dto: AiSearchDto): Promise<{}>;
    syncEmbeddings(): Promise<{
        message: string;
    }>;
}

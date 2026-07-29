import { AiService } from './ai.service';
import { AiGenerationDto } from './dto/ai.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getCapabilities(): {
        provider: string;
        capabilities: string[];
    };
    generate(dto: AiGenerationDto): Promise<import("./dto/ai.dto").AiGenerationResult>;
}

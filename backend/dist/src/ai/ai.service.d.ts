import { BaseService } from '../shared/abstractions/base.service';
import { MockAiProvider } from './ai.provider';
import { AiGenerationDto } from './dto/ai.dto';
export declare class AiService extends BaseService {
    private readonly provider;
    constructor(provider: MockAiProvider);
    generate(dto: AiGenerationDto): Promise<import("./dto/ai.dto").AiGenerationResult>;
    getCapabilities(): {
        provider: string;
        capabilities: string[];
    };
}

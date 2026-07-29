import { ConfigService } from '@nestjs/config';
import { AiGenerationDto, AiGenerationResult } from './dto/ai.dto';
export interface AiProvider {
    readonly name: string;
    generate(dto: AiGenerationDto): Promise<AiGenerationResult>;
}
export declare class MockAiProvider implements AiProvider {
    private readonly configService;
    readonly name = "mock-ai";
    constructor(configService: ConfigService);
    generate(dto: AiGenerationDto): Promise<AiGenerationResult>;
    private buildOutput;
}

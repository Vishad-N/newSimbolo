import { BaseAgent } from './base.agent';
import { GeminiProvider } from '../../providers/gemini.provider';
import { SessionMemoryData } from '../conversation.memory';
export declare class ClarificationAgent extends BaseAgent {
    constructor(provider: GeminiProvider);
    get intentName(): string;
    process(message: string, session: SessionMemoryData, contextOverrides?: Record<string, any>): Promise<{
        response: string;
        recommendations: string[];
    }>;
}

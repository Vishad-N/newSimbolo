import { AIProvider } from '../../providers/ai-provider.interface';
import { SessionMemoryData } from '../conversation.memory';
export declare abstract class BaseAgent {
    protected readonly provider: AIProvider;
    constructor(provider: AIProvider);
    abstract get intentName(): string;
    abstract process(message: string, session: SessionMemoryData, contextOverrides?: Record<string, any>): Promise<{
        response: string;
        data?: any;
        recommendations?: string[];
    }>;
}

import { AIProvider } from '../../providers/ai-provider.interface';
import { SessionMemoryData } from '../conversation.memory';

export abstract class BaseAgent {
  constructor(protected readonly provider: AIProvider) {}

  abstract get intentName(): string;

  abstract process(
    message: string,
    session: SessionMemoryData,
    contextOverrides?: Record<string, any>,
  ): Promise<{ response: string; data?: any; recommendations?: string[] }>;
}

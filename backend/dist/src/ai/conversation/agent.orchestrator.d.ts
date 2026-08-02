import { GeminiProvider } from '../providers/gemini.provider';
import { SessionMemory } from './conversation.memory';
import { SearchAgent } from './agents/search.agent';
import { ClarificationAgent } from './agents/clarification.agent';
import { BudgetAgent } from './agents/budget.agent';
export declare class AgentOrchestrator {
    private readonly provider;
    private readonly memory;
    private readonly searchAgent;
    private readonly clarificationAgent;
    private readonly budgetAgent;
    private readonly logger;
    private agents;
    constructor(provider: GeminiProvider, memory: SessionMemory, searchAgent: SearchAgent, clarificationAgent: ClarificationAgent, budgetAgent: BudgetAgent);
    private registerAgent;
    processMessage(sessionId: string, message: string, contextOverrides?: Record<string, any>): Promise<{
        intent: string;
        content: string;
        recommendations: string[] | undefined;
        data: any;
    }>;
    private detectIntent;
}

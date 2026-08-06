import { AgentOrchestrator } from './agent.orchestrator';
import { ChatRequestDto } from './conversation.dto';
import { SessionMemory } from './conversation.memory';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ConversationController {
    private readonly orchestrator;
    private readonly memory;
    private readonly prisma;
    constructor(orchestrator: AgentOrchestrator, memory: SessionMemory, prisma: PrismaService);
    chat(dto: ChatRequestDto): Promise<{
        intent: string;
        content: string;
        recommendations: string[] | undefined;
        data: any;
    }>;
    getHistory(sessionId: string): Promise<import("./conversation.memory").SessionMemoryData>;
    getAnalytics(): Promise<{
        totalConversations: number;
        actions: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AiAnalyticsGroupByOutputType, "actionType"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}

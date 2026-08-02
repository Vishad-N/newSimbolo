import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';
import { AiEmbeddingService } from './ai-embedding.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConversationController } from './conversation/conversation.controller';
import { SessionMemory } from './conversation/conversation.memory';
import { AgentOrchestrator } from './conversation/agent.orchestrator';
import { SearchAgent } from './conversation/agents/search.agent';
import { ClarificationAgent } from './conversation/agents/clarification.agent';
import { BudgetAgent } from './conversation/agents/budget.agent';

@Module({
  imports: [PrismaModule],
  controllers: [AiController, ConversationController],
  providers: [
    AiService, 
    GeminiProvider, 
    AiEmbeddingService,
    SessionMemory,
    AgentOrchestrator,
    SearchAgent,
    ClarificationAgent,
    BudgetAgent
  ],
  exports: [AiService, AiEmbeddingService, AgentOrchestrator],
})
export class AiModule {}

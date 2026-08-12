import { Injectable, Logger } from '@nestjs/common';
import { SchemaType } from '@google/generative-ai';
import { GeminiProvider } from '../providers/gemini.provider';
import { SessionMemory, SessionMemoryData } from './conversation.memory';
import { BaseAgent } from './agents/base.agent';
import { SearchAgent } from './agents/search.agent';
import { ClarificationAgent } from './agents/clarification.agent';
import { BudgetAgent } from './agents/budget.agent';

@Injectable()
export class AgentOrchestrator {
  private readonly logger = new Logger(AgentOrchestrator.name);
  private agents: Map<string, BaseAgent> = new Map();

  constructor(
    private readonly provider: GeminiProvider,
    private readonly memory: SessionMemory,
    private readonly searchAgent: SearchAgent,
    private readonly clarificationAgent: ClarificationAgent,
    private readonly budgetAgent: BudgetAgent,
  ) {
    this.registerAgent(searchAgent);
    this.registerAgent(clarificationAgent);
    this.registerAgent(budgetAgent);
  }

  private registerAgent(agent: BaseAgent) {
    this.agents.set(agent.intentName, agent);
  }

  async processMessage(sessionId: string, message: string, contextOverrides?: Record<string, any>) {
    const session = await this.memory.getSession(sessionId);

    const intentResult = await this.detectIntent(message, session);

    if (intentResult.extractedContext) {
      await this.memory.updateMetadata(sessionId, intentResult.extractedContext);
    }

    await this.memory.appendMessage(sessionId, {
      role: 'user',
      content: message,
      intentDetected: intentResult.intent,
    });

    // Re-fetch session to get updated metadata
    const updatedSession = await this.memory.getSession(sessionId);

    const agent = this.agents.get(intentResult.intent) || this.clarificationAgent;

    this.logger.log(`Routing message to ${agent.intentName}`);

    const response = await agent.process(message, updatedSession, contextOverrides);

    await this.memory.appendMessage(sessionId, {
      role: 'assistant',
      content: response.response,
      intentDetected: agent.intentName,
    });

    return {
      intent: agent.intentName,
      content: response.response,
      recommendations: response.recommendations,
      data: (response as any).data,
    };
  }

  private async detectIntent(message: string, session: SessionMemoryData) {
    const prompt = `
      You are the Intent Detector for The Simbolo, an AI Digital Marketing SaaS Platform.
      Analyze the user's latest message and their chat history to determine their intent.

      Available Intents:
      - SEARCH: User is looking for services, packages, or experts.
      - BUDGET_PLANNING: User mentions their budget and wants recommendations based on it.
      - CLARIFICATION: User asks a general question or doesn't provide enough context, so we need to ask follow-up questions.
      
      User Message: "${message}"

      Extract any useful context (budget, industry, goals, preferredServices).
    `;

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        intent: { type: SchemaType.STRING, enum: ['SEARCH', 'BUDGET_PLANNING', 'CLARIFICATION'] },
        extractedContext: {
          type: SchemaType.OBJECT,
          properties: {
            budget: { type: SchemaType.STRING },
            industry: { type: SchemaType.STRING },
            goals: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          },
        },
      },
      required: ['intent'],
    };

    try {
      const response = await this.provider.chat<{ intent: string; extractedContext?: any }>(
        session.history.slice(-5),
        prompt,
        schema,
      );
      return response;
    } catch (e) {
      this.logger.error('Intent detection failed, falling back to CLARIFICATION', e);
      return { intent: 'CLARIFICATION' };
    }
  }
}

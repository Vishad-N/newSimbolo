import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base.agent';
import { GeminiProvider } from '../../providers/gemini.provider';
import { SessionMemoryData } from '../conversation.memory';
import { AiService } from '../../ai.service';
import { SearchResponse } from '../../interfaces/search-response.interface';

@Injectable()
export class BudgetAgent extends BaseAgent {
  constructor(
    provider: GeminiProvider,
    private readonly aiService: AiService
  ) {
    super(provider);
  }

  get intentName() {
    return 'BUDGET_PLANNING';
  }

  async process(message: string, session: SessionMemoryData, contextOverrides?: Record<string, any>) {
    const budget = session.metadata.budget;
    
    const searchResult = await this.aiService.search({ 
      query: `Find services and packages that fit a budget of ${budget}. User says: ${message}. Industry: ${session.metadata.industry || 'Any'}.` 
    });

    const typedResult = searchResult as SearchResponse;

    const customPrompt = `
      You are the Simbolo Budget Planner.
      The user has a budget of ${budget} and said: "${message}".
      
      We retrieved these packages: ${typedResult.recommendedPackage}.
      Write a friendly message explaining how we can maximize their budget with these packages.
    `;
    
    const responseText = await this.provider.chat<string>(session.history.slice(-5), customPrompt);

    return {
      response: responseText,
      data: typedResult,
      recommendations: ["What is included in the package?", "Can I customize the package?"]
    };
  }
}

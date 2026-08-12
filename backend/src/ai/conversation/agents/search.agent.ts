import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base.agent';
import { GeminiProvider } from '../../providers/gemini.provider';
import { SessionMemoryData } from '../conversation.memory';
import { AiService } from '../../ai.service';
import { SearchResponse } from '../../interfaces/search-response.interface';

@Injectable()
export class SearchAgent extends BaseAgent {
  constructor(
    provider: GeminiProvider,
    private readonly aiService: AiService,
  ) {
    super(provider);
  }

  get intentName() {
    return 'SEARCH';
  }

  async process(message: string, session: SessionMemoryData, contextOverrides?: Record<string, any>) {
    const fullQuery = `
      ${message}
      Context: 
      - Budget: ${session.metadata.budget || 'Any'}
      - Industry: ${session.metadata.industry || 'Any'}
      - Goals: ${session.metadata.goals?.join(', ') || 'Any'}
    `;

    // Reusing the hybrid semantic search logic from AiService
    // We pass the full query (including context) so the embedding generation considers industry and goals.
    const searchResult = await this.aiService.search({ query: fullQuery });

    // Ensure it's typed properly from search
    const typedResult = searchResult as SearchResponse;

    return {
      response: typedResult.summary,
      data: typedResult,
      recommendations: typedResult.suggestions?.map((s) => s.label) || ['Show me more packages', 'Talk to an expert'],
    };
  }
}

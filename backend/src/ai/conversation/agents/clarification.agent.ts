import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base.agent';
import { GeminiProvider } from '../../providers/gemini.provider';
import { SessionMemoryData } from '../conversation.memory';

@Injectable()
export class ClarificationAgent extends BaseAgent {
  constructor(provider: GeminiProvider) {
    super(provider);
  }

  get intentName() {
    return 'CLARIFICATION';
  }

  async process(message: string, session: SessionMemoryData, contextOverrides?: Record<string, any>) {
    const prompt = `
      You are a friendly Digital Marketing Consultant for The Simbolo.
      The user is asking for services, but we need more context to provide accurate recommendations.
      
      Current known context:
      - Budget: ${session.metadata.budget || 'Unknown'}
      - Industry: ${session.metadata.industry || 'Unknown'}
      - Goals: ${session.metadata.goals?.join(', ') || 'Unknown'}
      
      Ask ONE OR TWO natural, conversational follow-up questions to fill in the missing context.
      Do not be overly robotic. Be helpful and consultative.
      
      User's latest message: "${message}"
    `;

    const responseText = await this.provider.chat<string>(session.history.slice(-5), prompt);

    return {
      response: responseText,
      recommendations: ['I have a limited budget', "I'm in the e-commerce industry", 'I want to increase my sales'],
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';
import { AIProvider } from './ai-provider.interface';
import { LlmSearchResponse } from '../interfaces/search-response.interface';

@Injectable()
export class GeminiProvider implements AIProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly generationModel: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.generationModel = this.configService.get<string>('GEMINI_GENERATION_MODEL') || 'gemini-3.5-flash';
  }

  async search(prompt: string): Promise<LlmSearchResponse> {
    const model = this.genAI.getGenerativeModel({
      model: this.generationModel,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: this.getSchema(),
      },
    });

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text) as LlmSearchResponse;
    } catch (error) {
      this.logger.error('Failed to generate search response from Gemini', error);
      throw error;
    }
  }

  async chat<T = any>(history: any[], prompt: string, schema?: any): Promise<T> {
    const model = this.genAI.getGenerativeModel({
      model: this.generationModel,
      generationConfig: schema
        ? {
            responseMimeType: 'application/json',
            responseSchema: schema as Schema,
          }
        : undefined,
    });

    const formattedHistory = history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    }));

    const chatSession = model.startChat({ history: formattedHistory });

    try {
      const result = await chatSession.sendMessage(prompt);
      const text = result.response.text();
      return (schema ? JSON.parse(text) : text) as T;
    } catch (error) {
      this.logger.error('Failed to generate chat response from Gemini', error);
      throw error;
    }
  }

  private getSchema(): Schema {
    return {
      type: SchemaType.OBJECT,
      properties: {
        summary: {
          type: SchemaType.STRING,
          description: 'A concise, engaging summary recommending the best path forward.',
        },
        matchPercentage: { type: SchemaType.INTEGER, description: 'A match percentage score up to 99.' },
        recommendedService: { type: SchemaType.STRING, description: 'The name of the most recommended service.' },
        recommendedPackage: { type: SchemaType.STRING, description: 'The name of the most recommended package.' },
        suggestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              label: { type: SchemaType.STRING },
            },
            required: ['id', 'label'],
          },
        },
      },
      required: ['summary', 'matchPercentage', 'recommendedService', 'recommendedPackage', 'suggestions'],
    };
  }
}

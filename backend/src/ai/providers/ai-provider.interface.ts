import { LlmSearchResponse } from '../interfaces/search-response.interface';

export interface AIProvider {
  search(prompt: string): Promise<LlmSearchResponse>;
  chat<T = any>(history: any[], prompt: string, schema?: any): Promise<T>;
}

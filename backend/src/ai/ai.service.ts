import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { MockAiProvider } from './ai.provider';
import { AiGenerationDto } from './dto/ai.dto';

@Injectable()
export class AiService extends BaseService {
  constructor(private readonly provider: MockAiProvider) {
    super('AiService');
  }

  generate(dto: AiGenerationDto) {
    return this.provider.generate(dto);
  }

  getCapabilities() {
    return {
      provider: this.provider.name,
      capabilities: [
        'Generate Blog Drafts',
        'Improve Existing Content',
        'SEO Recommendations',
        'Meta Title Suggestions',
        'Meta Description Suggestions',
        'FAQ Generation',
        'Service Description Suggestions',
        'Marketing Copy Suggestions',
        'Landing Page Copy Assistance',
        'Email Draft Assistance',
      ],
    };
  }
}

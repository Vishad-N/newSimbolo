import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiCapability, AiGenerationDto, AiGenerationResult } from './dto/ai.dto';

export interface AiProvider {
  readonly name: string;
  generate(dto: AiGenerationDto): Promise<AiGenerationResult>;
}

@Injectable()
export class MockAiProvider implements AiProvider {
  readonly name = 'mock-ai';

  constructor(private readonly configService: ConfigService) {}

  async generate(dto: AiGenerationDto): Promise<AiGenerationResult> {
    const brandVoice = this.configService.get<string>('ai.brandVoice', 'clear, conversion-focused, and practical');
    const tone = dto.tone ?? 'professional';
    const capabilityLabel = dto.capability.toLowerCase().replace(/_/g, ' ');
    const baseContext = dto.content ? `\n\nReference content:\n${dto.content.slice(0, 1200)}` : '';

    return {
      provider: this.name,
      capability: dto.capability,
      output: this.buildOutput(dto.capability, dto.prompt, tone, brandVoice, baseContext),
      suggestions: [
        'Review factual claims before publishing.',
        'Adapt examples to the target service and audience.',
        'Add campaign-specific metrics when available.',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  private buildOutput(
    capability: AiCapability,
    prompt: string,
    tone: string,
    brandVoice: string,
    context: string,
  ): string {
    const intro = `Drafted in a ${tone} tone using a ${brandVoice} voice.`;
    switch (capability) {
      case AiCapability.META_TITLE:
        return `${prompt.slice(0, 54)} | The Simbolo`;
      case AiCapability.META_DESCRIPTION:
        return `${prompt.slice(0, 130)}. Get a focused strategy, execution plan, and measurable outcomes with The Simbolo.`;
      case AiCapability.FAQ_GENERATION:
        return `${intro}\n\nQ: What problem does this solve?\nA: ${prompt}\n\nQ: How quickly can we start?\nA: We begin with discovery, scope alignment, and a clear execution roadmap.\n\nQ: How is success measured?\nA: Success is measured through agreed KPIs, reporting cadence, and delivery milestones.${context}`;
      case AiCapability.SEO_RECOMMENDATIONS:
        return `${intro}\n\n1. Target one primary keyword and two supporting clusters.\n2. Strengthen internal links to relevant service pages.\n3. Add FAQ schema and concise answer blocks.\n4. Improve above-the-fold clarity around the user intent.${context}`;
      case AiCapability.EMAIL_DRAFT:
        return `${intro}\n\nSubject: Next steps for ${prompt}\n\nHi,\n\nHere is a concise update and recommended next step for ${prompt}. We can align on priority, timeline, and ownership before moving ahead.\n\nRegards,\nThe Simbolo Team${context}`;
      default:
        return `${intro}\n\n${prompt}\n\nRecommended structure:\n- Clear problem statement\n- Outcome-focused positioning\n- Proof points or differentiators\n- Practical next step${context}`;
    }
  }
}

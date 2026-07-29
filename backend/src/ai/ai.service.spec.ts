import { ConfigService } from '@nestjs/config';
import { MockAiProvider } from './ai.provider';
import { AiService } from './ai.service';
import { AiCapability } from './dto/ai.dto';

describe('AiService', () => {
  it('delegates generation through the configured provider abstraction', async () => {
    const configService = { get: jest.fn().mockReturnValue('direct and useful') };
    const service = new AiService(new MockAiProvider(configService as unknown as ConfigService));

    const result = await service.generate({
      capability: AiCapability.META_TITLE,
      prompt: 'SEO services for local businesses',
    });

    expect(result.provider).toBe('mock-ai');
    expect(result.output).toContain('The Simbolo');
  });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ai_provider_1 = require("./ai.provider");
const ai_service_1 = require("./ai.service");
const ai_dto_1 = require("./dto/ai.dto");
describe('AiService', () => {
    it('delegates generation through the configured provider abstraction', async () => {
        const configService = { get: jest.fn().mockReturnValue('direct and useful') };
        const service = new ai_service_1.AiService(new ai_provider_1.MockAiProvider(configService));
        const result = await service.generate({
            capability: ai_dto_1.AiCapability.META_TITLE,
            prompt: 'SEO services for local businesses',
        });
        expect(result.provider).toBe('mock-ai');
        expect(result.output).toContain('The Simbolo');
    });
});
//# sourceMappingURL=ai.service.spec.js.map
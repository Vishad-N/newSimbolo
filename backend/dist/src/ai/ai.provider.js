"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAiProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_dto_1 = require("./dto/ai.dto");
let MockAiProvider = class MockAiProvider {
    configService;
    name = 'mock-ai';
    constructor(configService) {
        this.configService = configService;
    }
    async generate(dto) {
        const brandVoice = this.configService.get('ai.brandVoice', 'clear, conversion-focused, and practical');
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
    buildOutput(capability, prompt, tone, brandVoice, context) {
        const intro = `Drafted in a ${tone} tone using a ${brandVoice} voice.`;
        switch (capability) {
            case ai_dto_1.AiCapability.META_TITLE:
                return `${prompt.slice(0, 54)} | The Simbolo`;
            case ai_dto_1.AiCapability.META_DESCRIPTION:
                return `${prompt.slice(0, 130)}. Get a focused strategy, execution plan, and measurable outcomes with The Simbolo.`;
            case ai_dto_1.AiCapability.FAQ_GENERATION:
                return `${intro}\n\nQ: What problem does this solve?\nA: ${prompt}\n\nQ: How quickly can we start?\nA: We begin with discovery, scope alignment, and a clear execution roadmap.\n\nQ: How is success measured?\nA: Success is measured through agreed KPIs, reporting cadence, and delivery milestones.${context}`;
            case ai_dto_1.AiCapability.SEO_RECOMMENDATIONS:
                return `${intro}\n\n1. Target one primary keyword and two supporting clusters.\n2. Strengthen internal links to relevant service pages.\n3. Add FAQ schema and concise answer blocks.\n4. Improve above-the-fold clarity around the user intent.${context}`;
            case ai_dto_1.AiCapability.EMAIL_DRAFT:
                return `${intro}\n\nSubject: Next steps for ${prompt}\n\nHi,\n\nHere is a concise update and recommended next step for ${prompt}. We can align on priority, timeline, and ownership before moving ahead.\n\nRegards,\nThe Simbolo Team${context}`;
            default:
                return `${intro}\n\n${prompt}\n\nRecommended structure:\n- Clear problem statement\n- Outcome-focused positioning\n- Proof points or differentiators\n- Practical next step${context}`;
        }
    }
};
exports.MockAiProvider = MockAiProvider;
exports.MockAiProvider = MockAiProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MockAiProvider);
//# sourceMappingURL=ai.provider.js.map
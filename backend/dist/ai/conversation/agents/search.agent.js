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
exports.SearchAgent = void 0;
const common_1 = require("@nestjs/common");
const base_agent_1 = require("./base.agent");
const gemini_provider_1 = require("../../providers/gemini.provider");
const ai_service_1 = require("../../ai.service");
let SearchAgent = class SearchAgent extends base_agent_1.BaseAgent {
    aiService;
    constructor(provider, aiService) {
        super(provider);
        this.aiService = aiService;
    }
    get intentName() {
        return 'SEARCH';
    }
    async process(message, session, contextOverrides) {
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
        const typedResult = searchResult;
        return {
            response: typedResult.summary,
            data: typedResult,
            recommendations: typedResult.suggestions?.map((s) => s.label) || ['Show me more packages', 'Talk to an expert'],
        };
    }
};
exports.SearchAgent = SearchAgent;
exports.SearchAgent = SearchAgent = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_provider_1.GeminiProvider,
        ai_service_1.AiService])
], SearchAgent);
//# sourceMappingURL=search.agent.js.map
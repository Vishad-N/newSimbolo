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
exports.BudgetAgent = void 0;
const common_1 = require("@nestjs/common");
const base_agent_1 = require("./base.agent");
const gemini_provider_1 = require("../../providers/gemini.provider");
const ai_service_1 = require("../../ai.service");
let BudgetAgent = class BudgetAgent extends base_agent_1.BaseAgent {
    aiService;
    constructor(provider, aiService) {
        super(provider);
        this.aiService = aiService;
    }
    get intentName() {
        return 'BUDGET_PLANNING';
    }
    async process(message, session, contextOverrides) {
        const budget = session.metadata.budget;
        const searchResult = await this.aiService.search({
            query: `Find services and packages that fit a budget of ${budget}. User says: ${message}. Industry: ${session.metadata.industry || 'Any'}.`
        });
        const typedResult = searchResult;
        const customPrompt = `
      You are the Simbolo Budget Planner.
      The user has a budget of ${budget} and said: "${message}".
      
      We retrieved these packages: ${typedResult.recommendedPackage}.
      Write a friendly message explaining how we can maximize their budget with these packages.
    `;
        const responseText = await this.provider.chat(session.history.slice(-5), customPrompt);
        return {
            response: responseText,
            data: typedResult,
            recommendations: ["What is included in the package?", "Can I customize the package?"]
        };
    }
};
exports.BudgetAgent = BudgetAgent;
exports.BudgetAgent = BudgetAgent = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_provider_1.GeminiProvider,
        ai_service_1.AiService])
], BudgetAgent);
//# sourceMappingURL=budget.agent.js.map
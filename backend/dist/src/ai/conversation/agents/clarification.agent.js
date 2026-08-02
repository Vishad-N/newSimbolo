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
exports.ClarificationAgent = void 0;
const common_1 = require("@nestjs/common");
const base_agent_1 = require("./base.agent");
const gemini_provider_1 = require("../../providers/gemini.provider");
let ClarificationAgent = class ClarificationAgent extends base_agent_1.BaseAgent {
    constructor(provider) {
        super(provider);
    }
    get intentName() {
        return 'CLARIFICATION';
    }
    async process(message, session, contextOverrides) {
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
        const responseText = await this.provider.chat(session.history.slice(-5), prompt);
        return {
            response: responseText,
            recommendations: ["I have a limited budget", "I'm in the e-commerce industry", "I want to increase my sales"]
        };
    }
};
exports.ClarificationAgent = ClarificationAgent;
exports.ClarificationAgent = ClarificationAgent = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_provider_1.GeminiProvider])
], ClarificationAgent);
//# sourceMappingURL=clarification.agent.js.map
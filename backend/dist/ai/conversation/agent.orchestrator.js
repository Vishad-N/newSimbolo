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
var AgentOrchestrator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOrchestrator = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const gemini_provider_1 = require("../providers/gemini.provider");
const conversation_memory_1 = require("./conversation.memory");
const search_agent_1 = require("./agents/search.agent");
const clarification_agent_1 = require("./agents/clarification.agent");
const budget_agent_1 = require("./agents/budget.agent");
let AgentOrchestrator = AgentOrchestrator_1 = class AgentOrchestrator {
    provider;
    memory;
    searchAgent;
    clarificationAgent;
    budgetAgent;
    logger = new common_1.Logger(AgentOrchestrator_1.name);
    agents = new Map();
    constructor(provider, memory, searchAgent, clarificationAgent, budgetAgent) {
        this.provider = provider;
        this.memory = memory;
        this.searchAgent = searchAgent;
        this.clarificationAgent = clarificationAgent;
        this.budgetAgent = budgetAgent;
        this.registerAgent(searchAgent);
        this.registerAgent(clarificationAgent);
        this.registerAgent(budgetAgent);
    }
    registerAgent(agent) {
        this.agents.set(agent.intentName, agent);
    }
    async processMessage(sessionId, message, contextOverrides) {
        const session = await this.memory.getSession(sessionId);
        const intentResult = await this.detectIntent(message, session);
        if (intentResult.extractedContext) {
            await this.memory.updateMetadata(sessionId, intentResult.extractedContext);
        }
        await this.memory.appendMessage(sessionId, {
            role: 'user',
            content: message,
            intentDetected: intentResult.intent,
        });
        // Re-fetch session to get updated metadata
        const updatedSession = await this.memory.getSession(sessionId);
        const agent = this.agents.get(intentResult.intent) || this.clarificationAgent;
        this.logger.log(`Routing message to ${agent.intentName}`);
        const response = await agent.process(message, updatedSession, contextOverrides);
        await this.memory.appendMessage(sessionId, {
            role: 'assistant',
            content: response.response,
            intentDetected: agent.intentName,
        });
        return {
            intent: agent.intentName,
            content: response.response,
            recommendations: response.recommendations,
            data: response.data,
        };
    }
    async detectIntent(message, session) {
        const prompt = `
      You are the Intent Detector for The Simbolo, an AI Digital Marketing SaaS Platform.
      Analyze the user's latest message and their chat history to determine their intent.

      Available Intents:
      - SEARCH: User is looking for services, packages, or experts.
      - BUDGET_PLANNING: User mentions their budget and wants recommendations based on it.
      - CLARIFICATION: User asks a general question or doesn't provide enough context, so we need to ask follow-up questions.
      
      User Message: "${message}"

      Extract any useful context (budget, industry, goals, preferredServices).
    `;
        const schema = {
            type: generative_ai_1.SchemaType.OBJECT,
            properties: {
                intent: { type: generative_ai_1.SchemaType.STRING, enum: ['SEARCH', 'BUDGET_PLANNING', 'CLARIFICATION'] },
                extractedContext: {
                    type: generative_ai_1.SchemaType.OBJECT,
                    properties: {
                        budget: { type: generative_ai_1.SchemaType.STRING },
                        industry: { type: generative_ai_1.SchemaType.STRING },
                        goals: { type: generative_ai_1.SchemaType.ARRAY, items: { type: generative_ai_1.SchemaType.STRING } },
                    },
                },
            },
            required: ['intent'],
        };
        try {
            const response = await this.provider.chat(session.history.slice(-5), prompt, schema);
            return response;
        }
        catch (e) {
            this.logger.error('Intent detection failed, falling back to CLARIFICATION', e);
            return { intent: 'CLARIFICATION' };
        }
    }
};
exports.AgentOrchestrator = AgentOrchestrator;
exports.AgentOrchestrator = AgentOrchestrator = AgentOrchestrator_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_provider_1.GeminiProvider,
        conversation_memory_1.SessionMemory,
        search_agent_1.SearchAgent,
        clarification_agent_1.ClarificationAgent,
        budget_agent_1.BudgetAgent])
], AgentOrchestrator);
//# sourceMappingURL=agent.orchestrator.js.map
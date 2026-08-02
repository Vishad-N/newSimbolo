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
var GeminiProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let GeminiProvider = GeminiProvider_1 = class GeminiProvider {
    configService;
    logger = new common_1.Logger(GeminiProvider_1.name);
    genAI;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY') || '';
        if (!apiKey) {
            this.logger.warn('GEMINI_API_KEY is not configured');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async search(prompt) {
        const model = this.genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: this.getSchema(),
            }
        });
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return JSON.parse(text);
        }
        catch (error) {
            this.logger.error('Failed to generate search response from Gemini', error);
            throw error;
        }
    }
    async chat(history, prompt, schema) {
        const model = this.genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            generationConfig: schema ? {
                responseMimeType: "application/json",
                responseSchema: schema,
            } : undefined
        });
        const formattedHistory = history.map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
        }));
        const chatSession = model.startChat({ history: formattedHistory });
        try {
            const result = await chatSession.sendMessage(prompt);
            const text = result.response.text();
            return (schema ? JSON.parse(text) : text);
        }
        catch (error) {
            this.logger.error('Failed to generate chat response from Gemini', error);
            throw error;
        }
    }
    getSchema() {
        return {
            type: generative_ai_1.SchemaType.OBJECT,
            properties: {
                summary: { type: generative_ai_1.SchemaType.STRING, description: "A concise, engaging summary recommending the best path forward." },
                matchPercentage: { type: generative_ai_1.SchemaType.INTEGER, description: "A match percentage score up to 99." },
                recommendedService: { type: generative_ai_1.SchemaType.STRING, description: "The name of the most recommended service." },
                recommendedPackage: { type: generative_ai_1.SchemaType.STRING, description: "The name of the most recommended package." },
                experts: {
                    type: generative_ai_1.SchemaType.ARRAY,
                    items: {
                        type: generative_ai_1.SchemaType.OBJECT,
                        properties: {
                            id: { type: generative_ai_1.SchemaType.STRING },
                            name: { type: generative_ai_1.SchemaType.STRING },
                            title: { type: generative_ai_1.SchemaType.STRING },
                            rating: { type: generative_ai_1.SchemaType.NUMBER },
                            projectsCompleted: { type: generative_ai_1.SchemaType.INTEGER },
                            specialization: { type: generative_ai_1.SchemaType.STRING },
                            responseTime: { type: generative_ai_1.SchemaType.STRING },
                            hourlyPrice: { type: generative_ai_1.SchemaType.NUMBER },
                            imageUrl: { type: generative_ai_1.SchemaType.STRING },
                            isSimboloExpert: { type: generative_ai_1.SchemaType.BOOLEAN },
                            skills: { type: generative_ai_1.SchemaType.ARRAY, items: { type: generative_ai_1.SchemaType.STRING } },
                            experience: { type: generative_ai_1.SchemaType.STRING },
                            availability: { type: generative_ai_1.SchemaType.STRING },
                        },
                        required: ["id", "name", "title", "rating", "projectsCompleted", "specialization", "responseTime", "hourlyPrice", "imageUrl", "isSimboloExpert", "skills", "experience", "availability"]
                    }
                },
                suggestions: {
                    type: generative_ai_1.SchemaType.ARRAY,
                    items: {
                        type: generative_ai_1.SchemaType.OBJECT,
                        properties: {
                            id: { type: generative_ai_1.SchemaType.STRING },
                            label: { type: generative_ai_1.SchemaType.STRING }
                        },
                        required: ["id", "label"]
                    }
                },
                reviews: {
                    type: generative_ai_1.SchemaType.ARRAY,
                    items: {
                        type: generative_ai_1.SchemaType.OBJECT,
                        properties: {
                            id: { type: generative_ai_1.SchemaType.STRING },
                            name: { type: generative_ai_1.SchemaType.STRING },
                            avatarUrl: { type: generative_ai_1.SchemaType.STRING },
                            rating: { type: generative_ai_1.SchemaType.INTEGER },
                            servicePurchased: { type: generative_ai_1.SchemaType.STRING },
                            content: { type: generative_ai_1.SchemaType.STRING },
                            date: { type: generative_ai_1.SchemaType.STRING }
                        },
                        required: ["id", "name", "avatarUrl", "rating", "servicePurchased", "content", "date"]
                    }
                },
                relatedServices: {
                    type: generative_ai_1.SchemaType.ARRAY,
                    items: {
                        type: generative_ai_1.SchemaType.OBJECT,
                        properties: {
                            id: { type: generative_ai_1.SchemaType.STRING },
                            title: { type: generative_ai_1.SchemaType.STRING },
                            description: { type: generative_ai_1.SchemaType.STRING },
                            icon: { type: generative_ai_1.SchemaType.STRING }
                        },
                        required: ["id", "title", "description", "icon"]
                    }
                }
            },
            required: ["summary", "matchPercentage", "recommendedService", "recommendedPackage", "experts", "suggestions", "reviews", "relatedServices"]
        };
    }
};
exports.GeminiProvider = GeminiProvider;
exports.GeminiProvider = GeminiProvider = GeminiProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiProvider);
//# sourceMappingURL=gemini.provider.js.map
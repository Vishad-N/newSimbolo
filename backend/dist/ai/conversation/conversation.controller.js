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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_orchestrator_1 = require("./agent.orchestrator");
const conversation_dto_1 = require("./conversation.dto");
const conversation_memory_1 = require("./conversation.memory");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const prisma_service_1 = require("../../prisma/prisma.service");
let ConversationController = class ConversationController {
    orchestrator;
    memory;
    prisma;
    constructor(orchestrator, memory, prisma) {
        this.orchestrator = orchestrator;
        this.memory = memory;
        this.prisma = prisma;
    }
    async chat(dto) {
        return this.orchestrator.processMessage(dto.sessionId, dto.message, dto.context);
    }
    async getHistory(sessionId) {
        return this.memory.getSession(sessionId);
    }
    async getAnalytics() {
        const totalConversations = await this.prisma.aiConversation.count();
        const actions = await this.prisma.aiAnalytics.groupBy({
            by: ['actionType'],
            _count: {
                id: true,
            },
        });
        return {
            totalConversations,
            actions
        };
    }
};
exports.ConversationController = ConversationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message to the AI multi-agent system' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [conversation_dto_1.ChatRequestDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)(':sessionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve chat history' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('analytics/metrics'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, permissions_decorator_1.Permissions)('ai.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI Interaction Analytics' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getAnalytics", null);
exports.ConversationController = ConversationController = __decorate([
    (0, swagger_1.ApiTags)('AI Conversation'),
    (0, common_1.Controller)('ai/chat'),
    __metadata("design:paramtypes", [agent_orchestrator_1.AgentOrchestrator,
        conversation_memory_1.SessionMemory,
        prisma_service_1.PrismaService])
], ConversationController);
//# sourceMappingURL=conversation.controller.js.map
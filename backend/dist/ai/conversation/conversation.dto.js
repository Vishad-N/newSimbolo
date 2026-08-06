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
exports.ChatResponseDto = exports.ChatRequestDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChatRequestDto {
    sessionId;
    message;
    context;
    static _OPENAPI_METADATA_FACTORY() {
        return { sessionId: { required: true, type: () => String }, message: { required: true, type: () => String }, context: { required: false, type: "object", additionalProperties: true } };
    }
}
exports.ChatRequestDto = ChatRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The unique session ID of the anonymous or authenticated user' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The user message content' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Optional context overrides or current page context', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ChatRequestDto.prototype, "context", void 0);
class ChatResponseDto {
    intent;
    content;
    recommendations;
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { intent: { required: true, type: () => String }, content: { required: true, type: () => String }, recommendations: { required: false, type: () => [String] }, data: { required: false, type: "object", additionalProperties: true } };
    }
}
exports.ChatResponseDto = ChatResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The orchestrator determined intent' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "intent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The actual response content' }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Recommended actions or quick replies' }),
    __metadata("design:type", Array)
], ChatResponseDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Structured JSON data related to the intent', required: false }),
    __metadata("design:type", Object)
], ChatResponseDto.prototype, "data", void 0);
//# sourceMappingURL=conversation.dto.js.map
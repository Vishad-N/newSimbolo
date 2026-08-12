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
exports.UpdateCommentDto = exports.CreateCommentDto = exports.CommentEntityType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var CommentEntityType;
(function (CommentEntityType) {
    CommentEntityType["TASK"] = "TASK";
})(CommentEntityType || (exports.CommentEntityType = CommentEntityType = {}));
class CreateCommentDto {
    entityType;
    entityId;
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { entityType: { required: true, type: () => String, enum: require("./comment.dto").CommentEntityType }, entityId: { required: true, type: () => String }, message: { required: true, type: () => String } };
    }
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CommentEntityType, description: 'Entity type the comment belongs to' }),
    (0, class_validator_1.IsEnum)(CommentEntityType),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity ID (task ID, etc.)', example: 'uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Comment message text', example: 'Please revise the keyword strategy section.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "message", void 0);
class UpdateCommentDto {
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String } };
    }
}
exports.UpdateCommentDto = UpdateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated comment message' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "message", void 0);
//# sourceMappingURL=comment.dto.js.map
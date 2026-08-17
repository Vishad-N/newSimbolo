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
exports.UpdateMilestoneDto = exports.CreateMilestoneDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateMilestoneDto {
    projectId;
    title;
    description;
    dueDate;
    dependsOnId;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { projectId: { required: true, type: () => String, format: "uuid" }, title: { required: true, type: () => String }, description: { required: false, type: () => String }, dueDate: { required: false, type: () => String }, dependsOnId: { required: false, type: () => String, format: "uuid" }, sortOrder: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.CreateMilestoneDto = CreateMilestoneDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMilestoneDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phase 1: Discovery & Research', description: 'Milestone title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMilestoneDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Complete stakeholder interviews, competitive analysis, and sitemap.',
        description: 'Milestone description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMilestoneDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-15T00:00:00.000Z', description: 'Due date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMilestoneDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'c0a80123-4567-89ab-cdef-0123456789ab',
        description: 'Milestone UUID this one depends on',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateMilestoneDto.prototype, "dependsOnId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 0, description: 'Sort order for display' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMilestoneDto.prototype, "sortOrder", void 0);
class UpdateMilestoneDto {
    title;
    description;
    dueDate;
    completedDate;
    status;
    sortOrder;
    dependsOnId;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, description: { required: false, type: () => String }, dueDate: { required: false, type: () => String }, completedDate: { required: false, type: () => String }, status: { required: false, enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED"] }, sortOrder: { required: false, type: () => Number, minimum: 0 }, dependsOnId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.UpdateMilestoneDto = UpdateMilestoneDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Phase 1: Discovery & Analysis', description: 'Milestone title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMilestoneDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Milestone description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMilestoneDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-15T00:00:00.000Z', description: 'Due date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateMilestoneDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-12T00:00:00.000Z', description: 'Completion date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateMilestoneDto.prototype, "completedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.MilestoneStatusEnum, description: 'Milestone status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.MilestoneStatusEnum),
    __metadata("design:type", String)
], UpdateMilestoneDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Sort order for display' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateMilestoneDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Dependency milestone UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], UpdateMilestoneDto.prototype, "dependsOnId", void 0);
//# sourceMappingURL=milestone.dto.js.map
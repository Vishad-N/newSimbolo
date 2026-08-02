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
exports.AddTaskCommentDto = exports.UpdateTaskDto = exports.CreateTaskDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateTaskDto {
    projectId;
    milestoneId;
    title;
    description;
    assignedToId;
    status;
    priority;
    estimatedHours;
    dueDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { projectId: { required: true, type: () => String, format: "uuid" }, milestoneId: { required: false, type: () => String, format: "uuid" }, title: { required: true, type: () => String }, description: { required: false, type: () => String }, assignedToId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: ["COMPLETED", "IN_PROGRESS", "TODO", "REVIEW", "BLOCKED"] }, priority: { required: false, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] }, estimatedHours: { required: false, type: () => Number, minimum: 0 }, dueDate: { required: false, type: () => String } };
    }
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Milestone UUID (optional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "milestoneId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Create wireframes for homepage', description: 'Task title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Create low-fidelity wireframes for the homepage hero and feature sections',
        description: 'Task description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Assigned user UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "assignedToId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TaskStatusEnum, default: client_1.TaskStatusEnum.TODO, description: 'Task status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TaskStatusEnum),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TaskPriorityEnum, default: client_1.TaskPriorityEnum.MEDIUM, description: 'Task priority' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TaskPriorityEnum),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 8, description: 'Estimated hours to complete' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-10T00:00:00.000Z', description: 'Task due date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "dueDate", void 0);
class UpdateTaskDto {
    title;
    description;
    assignedToId;
    status;
    priority;
    estimatedHours;
    actualHours;
    progress;
    dueDate;
    milestoneId;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, description: { required: false, type: () => String }, assignedToId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: ["COMPLETED", "IN_PROGRESS", "TODO", "REVIEW", "BLOCKED"] }, priority: { required: false, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] }, estimatedHours: { required: false, type: () => Number, minimum: 0 }, actualHours: { required: false, type: () => Number, minimum: 0 }, progress: { required: false, type: () => Number, minimum: 0, maximum: 100 }, dueDate: { required: false, type: () => String }, milestoneId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.UpdateTaskDto = UpdateTaskDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Task title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Task description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Assigned user UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "assignedToId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TaskStatusEnum, description: 'Task status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TaskStatusEnum),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TaskPriorityEnum, description: 'Task priority' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TaskPriorityEnum),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 8, description: 'Estimated hours' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateTaskDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 6.5, description: 'Actual hours spent' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateTaskDto.prototype, "actualHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 75, description: 'Progress percentage (0-100)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateTaskDto.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-10T00:00:00.000Z', description: 'Task due date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Milestone UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], UpdateTaskDto.prototype, "milestoneId", void 0);
class AddTaskCommentDto {
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String } };
    }
}
exports.AddTaskCommentDto = AddTaskCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'I have completed the wireframes. Please review.', description: 'Comment message' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddTaskCommentDto.prototype, "message", void 0);
//# sourceMappingURL=task.dto.js.map
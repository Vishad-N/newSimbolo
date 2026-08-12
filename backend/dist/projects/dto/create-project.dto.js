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
exports.CreateProjectDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateProjectDto {
    name;
    description;
    orderId;
    clientId;
    managerId;
    status;
    priority;
    budget;
    startDate;
    targetEndDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: false, type: () => String }, orderId: { required: true, type: () => String, format: "uuid" }, clientId: { required: true, type: () => String, format: "uuid" }, managerId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: ["ACTIVE", "IN_PROGRESS", "COMPLETED", "CANCELLED", "IN_REVIEW", "PLANNING", "NOT_STARTED", "ON_HOLD"] }, priority: { required: false, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] }, budget: { required: false, type: () => Number, minimum: 0 }, startDate: { required: false, type: () => String }, targetEndDate: { required: false, type: () => String } };
    }
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme Corp Website Redesign', description: 'Project name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Full website redesign and SEO optimization for Acme Corp',
        description: 'Project description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Order UUID this project belongs to' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Client profile UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project manager User UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "managerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ProjectStatusEnum,
        default: client_1.ProjectStatusEnum.PLANNING,
        description: 'Initial project status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProjectStatusEnum),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ProjectPriorityEnum,
        default: client_1.ProjectPriorityEnum.MEDIUM,
        description: 'Project priority',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProjectPriorityEnum),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 120000, description: 'Project budget in base currency' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "budget", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-01T00:00:00.000Z', description: 'Project start date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-10-31T00:00:00.000Z', description: 'Target end date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "targetEndDate", void 0);
//# sourceMappingURL=create-project.dto.js.map
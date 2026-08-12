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
exports.CreatePortfolioProjectDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreatePortfolioProjectDto {
    title;
    description;
    clientName;
    liveUrl;
    completionDate;
    status;
    isFeatured;
    serviceId;
    categoryId;
    coverImageId;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, clientName: { required: false, type: () => String }, liveUrl: { required: false, type: () => String }, completionDate: { required: false, type: () => String }, status: { required: false, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] }, isFeatured: { required: false, type: () => Boolean }, serviceId: { required: false, type: () => String, nullable: true, format: "uuid" }, categoryId: { required: false, type: () => String, nullable: true, format: "uuid" }, coverImageId: { required: false, type: () => String, nullable: true, format: "uuid" } };
    }
}
exports.CreatePortfolioProjectDto = CreatePortfolioProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FinTech App UI/UX Redesign & Animation Reel', description: 'Project title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePortfolioProjectDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Complete overhaul of mobile dashboard animations...', description: 'Description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePortfolioProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Acme Bank Ltd', description: 'Client name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePortfolioProjectDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://acmebank.example.com', description: 'Live preview URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePortfolioProjectDto.prototype, "liveUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-06-15T00:00:00.000Z', description: 'Completion date ISO string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePortfolioProjectDto.prototype, "completionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PortfolioStatusEnum, default: client_1.PortfolioStatusEnum.PUBLISHED }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PortfolioStatusEnum),
    __metadata("design:type", String)
], CreatePortfolioProjectDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: false, description: 'Highlight in featured gallery showcase' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePortfolioProjectDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreatePortfolioProjectDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'PortfolioCategory UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreatePortfolioProjectDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Cover image MediaAsset UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", Object)
], CreatePortfolioProjectDto.prototype, "coverImageId", void 0);
//# sourceMappingURL=create-portfolio-project.dto.js.map
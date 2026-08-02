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
exports.UpdateDeliverableDto = exports.CreateDeliverableDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateDeliverableDto {
    projectId;
    title;
    description;
    mediaAssetId;
    static _OPENAPI_METADATA_FACTORY() {
        return { projectId: { required: true, type: () => String, format: "uuid" }, title: { required: true, type: () => String }, description: { required: false, type: () => String }, mediaAssetId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateDeliverableDto = CreateDeliverableDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Homepage Design – Final Version', description: 'Deliverable title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Final homepage design based on approved wireframes',
        description: 'Deliverable description',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'c0a80123-4567-89ab-cdef-0123456789ab',
        description: 'Media asset UUID for the uploaded file',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateDeliverableDto.prototype, "mediaAssetId", void 0);
class UpdateDeliverableDto {
    title;
    description;
    status;
    revisionNotes;
    clientFeedback;
    mediaAssetId;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, description: { required: false, type: () => String }, status: { required: false, enum: ["PENDING", "APPROVED", "SUBMITTED", "REVISION_REQUESTED"] }, revisionNotes: { required: false, type: () => String }, clientFeedback: { required: false, type: () => String }, mediaAssetId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.UpdateDeliverableDto = UpdateDeliverableDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deliverable title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeliverableDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deliverable description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeliverableDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.DeliverableStatusEnum, description: 'Deliverable status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.DeliverableStatusEnum),
    __metadata("design:type", String)
], UpdateDeliverableDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Please adjust the color palette to match the updated brand guide.',
        description: 'Revision notes from client',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeliverableDto.prototype, "revisionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client feedback message' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeliverableDto.prototype, "clientFeedback", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'c0a80123-4567-89ab-cdef-0123456789ab',
        description: 'New media asset UUID (for version upload)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], UpdateDeliverableDto.prototype, "mediaAssetId", void 0);
//# sourceMappingURL=deliverable.dto.js.map
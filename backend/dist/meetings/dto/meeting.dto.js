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
exports.UpdateMeetingDto = exports.CreateMeetingDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateMeetingDto {
    title;
    description;
    agenda;
    startTime;
    endTime;
    timezone;
    meetUrl;
    hostId;
    clientId;
    participantIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, agenda: { required: false, type: () => String }, startTime: { required: true, type: () => String }, endTime: { required: true, type: () => String }, timezone: { required: false, type: () => String }, meetUrl: { required: false, type: () => String }, hostId: { required: true, type: () => String, format: "uuid" }, clientId: { required: false, type: () => String, format: "uuid" }, participantIds: { required: false, type: () => [String] } };
    }
}
exports.CreateMeetingDto = CreateMeetingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Project Kickoff – Acme Corp', description: 'Meeting title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Meeting description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '1. Introductions\n2. Project scope review\n3. Timeline alignment',
        description: 'Meeting agenda',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "agenda", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T10:00:00.000Z', description: 'Meeting start time (ISO 8601)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T11:00:00.000Z', description: 'Meeting end time (ISO 8601)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Asia/Kolkata', default: 'Asia/Kolkata', description: 'Timezone' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://meet.google.com/abc-defg-hij', description: 'Video meeting URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "meetUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Host user UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "hostId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Client profile UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateMeetingDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Participant user UUIDs to invite', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMeetingDto.prototype, "participantIds", void 0);
class UpdateMeetingDto {
    title;
    description;
    agenda;
    meetingNotes;
    status;
    startTime;
    endTime;
    meetUrl;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, description: { required: false, type: () => String }, agenda: { required: false, type: () => String }, meetingNotes: { required: false, type: () => String }, status: { required: false, enum: ["COMPLETED", "CANCELLED", "SCHEDULED", "RESCHEDULED", "NO_SHOW"] }, startTime: { required: false, type: () => String }, endTime: { required: false, type: () => String }, meetUrl: { required: false, type: () => String } };
    }
}
exports.UpdateMeetingDto = UpdateMeetingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Meeting title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Meeting description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Meeting agenda' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "agenda", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Meeting notes (recorded after meeting)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "meetingNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.MeetingStatusEnum, description: 'Meeting status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.MeetingStatusEnum),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Meeting start time (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Meeting end time (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Video meeting URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMeetingDto.prototype, "meetUrl", void 0);
//# sourceMappingURL=meeting.dto.js.map
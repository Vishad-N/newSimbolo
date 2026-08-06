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
exports.AssignTeamMemberDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AssignTeamMemberDto {
    projectId;
    userId;
    role;
    responsibilities;
    static _OPENAPI_METADATA_FACTORY() {
        return { projectId: { required: true, type: () => String, format: "uuid" }, userId: { required: true, type: () => String, format: "uuid" }, role: { required: false, type: () => String }, responsibilities: { required: false, type: () => String } };
    }
}
exports.AssignTeamMemberDto = AssignTeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignTeamMemberDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'User UUID to assign' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignTeamMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'DESIGNER',
        description: 'Role on the project (PROJECT_MANAGER, DESIGNER, DEVELOPER, VIDEO_EDITOR, SEO_SPECIALIST, MARKETING_SPECIALIST, MEMBER)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignTeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Responsible for all visual assets and brand guidelines',
        description: 'Description of responsibilities',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignTeamMemberDto.prototype, "responsibilities", void 0);
//# sourceMappingURL=assign-team-member.dto.js.map
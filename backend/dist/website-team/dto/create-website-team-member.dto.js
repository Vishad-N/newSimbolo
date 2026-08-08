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
exports.CreateWebsiteTeamMemberDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateWebsiteTeamMemberDto {
    name;
    designation;
    bio;
    image;
    displayOrder;
    socialLinks;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, designation: { required: true, type: () => String }, bio: { required: false, type: () => String }, image: { required: false, type: () => String }, displayOrder: { required: false, type: () => Number }, socialLinks: { required: false, type: "object", additionalProperties: { type: "string" } }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateWebsiteTeamMemberDto = CreateWebsiteTeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the team member' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebsiteTeamMemberDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The designation or role of the team member' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebsiteTeamMemberDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'A short bio of the team member' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebsiteTeamMemberDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL to the profile image' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebsiteTeamMemberDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display order for sorting', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateWebsiteTeamMemberDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Social links (e.g. linkedin, email)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWebsiteTeamMemberDto.prototype, "socialLinks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the member is actively displayed', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWebsiteTeamMemberDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-website-team-member.dto.js.map
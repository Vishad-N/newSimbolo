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
exports.CreateAffiliateEmployeeDto = exports.AdminSalesListQueryDto = exports.AdminWithdrawalListQueryDto = exports.AdminCommissionListQueryDto = exports.AdminAffiliateListQueryDto = exports.PaginationQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class PaginationQueryDto {
    page = 1;
    limit = 20;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 100 } };
    }
}
exports.PaginationQueryDto = PaginationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 20, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "limit", void 0);
class AdminAffiliateListQueryDto extends PaginationQueryDto {
    status;
    search;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: ["ACTIVE", "INACTIVE", "SUSPENDED"] }, search: { required: false, type: () => String } };
    }
}
exports.AdminAffiliateListQueryDto = AdminAffiliateListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.AffiliateStatusEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AffiliateStatusEnum),
    __metadata("design:type", String)
], AdminAffiliateListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Free-text search over employee code / name / email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminAffiliateListQueryDto.prototype, "search", void 0);
class AdminCommissionListQueryDto extends PaginationQueryDto {
    status;
    affiliateId;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: ["PENDING", "CANCELLED", "ELIGIBLE", "CREDITED", "REVERSED"] }, affiliateId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.AdminCommissionListQueryDto = AdminCommissionListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.CommissionStatusEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CommissionStatusEnum),
    __metadata("design:type", String)
], AdminCommissionListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdminCommissionListQueryDto.prototype, "affiliateId", void 0);
class AdminWithdrawalListQueryDto extends PaginationQueryDto {
    status;
    affiliateId;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: ["PENDING", "CANCELLED", "FAILED", "SCHEDULED", "PAID", "REVERSED", "PROCESSING"] }, affiliateId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.AdminWithdrawalListQueryDto = AdminWithdrawalListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.WithdrawalStatusEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.WithdrawalStatusEnum),
    __metadata("design:type", String)
], AdminWithdrawalListQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdminWithdrawalListQueryDto.prototype, "affiliateId", void 0);
class AdminSalesListQueryDto extends PaginationQueryDto {
    affiliateId;
    static _OPENAPI_METADATA_FACTORY() {
        return { affiliateId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.AdminSalesListQueryDto = AdminSalesListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdminSalesListQueryDto.prototype, "affiliateId", void 0);
class CreateAffiliateEmployeeDto {
    userId;
    email;
    firstName;
    lastName;
    password;
    countryCode;
    phone;
    commissionRate;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: false, type: () => String, format: "uuid" }, email: { required: false, type: () => String, format: "email" }, firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, password: { required: false, type: () => String, minLength: 8 }, countryCode: { required: false, type: () => String }, phone: { required: false, type: () => String }, commissionRate: { required: false, type: () => Number, minimum: 0, maximum: 100 } };
    }
}
exports.CreateAffiliateEmployeeDto = CreateAffiliateEmployeeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Existing user ID to convert into a sales employee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAffiliateEmployeeDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New employee email. Required when userId is omitted.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAffiliateEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New employee first name. Required when userId is omitted.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAffiliateEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New employee last name. Required when userId is omitted.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAffiliateEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New employee password. Required when userId is omitted.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateAffiliateEmployeeDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New employee phone country code, e.g. +91' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAffiliateEmployeeDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New employee phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAffiliateEmployeeDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Commission percentage override. Defaults to program default.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateAffiliateEmployeeDto.prototype, "commissionRate", void 0);
//# sourceMappingURL=admin-list-query.dto.js.map
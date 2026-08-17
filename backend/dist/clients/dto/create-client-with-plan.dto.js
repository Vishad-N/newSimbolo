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
exports.CreateClientWithPlanDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const phone_constant_1 = require("../../common/constants/phone.constant");
const gst_constant_1 = require("../../common/constants/gst.constant");
const name_constant_1 = require("../../common/constants/name.constant");
class CreateClientWithPlanDto {
    email;
    password;
    firstName;
    lastName;
    countryCode;
    phone;
    companyId;
    accountManagerId;
    gstNumber;
    billingAddress;
    timezone;
    notes;
    packageId;
    interval;
    price;
    currency;
    currentPeriodStart;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String, minLength: 8, pattern: "((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$" }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, countryCode: { required: false, type: () => String }, phone: { required: false, type: () => String }, companyId: { required: false, type: () => String, format: "uuid" }, accountManagerId: { required: false, type: () => String, format: "uuid" }, gstNumber: { required: false, type: () => String }, billingAddress: { required: false, type: () => String }, timezone: { required: false, type: () => String }, notes: { required: false, type: () => String }, packageId: { required: false, type: () => String, format: "uuid" }, interval: { required: false, enum: ["MONTHLY", "QUARTERLY", "ANNUALLY"] }, price: { required: false, type: () => Number, minimum: 1 }, currency: { required: false, type: () => String }, currentPeriodStart: { required: false, type: () => String } };
    }
}
exports.CreateClientWithPlanDto = CreateClientWithPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'client@example.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'StrongPass@123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must contain uppercase, lowercase, and numeric characters',
    }),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Client' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(name_constant_1.PERSON_NAME_PATTERN, { message: `First ${name_constant_1.PERSON_NAME_MESSAGE.toLowerCase()}` }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(name_constant_1.PERSON_NAME_PATTERN, { message: `Last ${name_constant_1.PERSON_NAME_MESSAGE.toLowerCase()}` }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+91', description: 'International dialing code' }),
    (0, class_validator_1.ValidateIf)((dto) => dto.phone !== undefined || dto.countryCode !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(phone_constant_1.COUNTRY_CODE_PATTERN, { message: phone_constant_1.COUNTRY_CODE_MESSAGE }),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '9999999999', description: '10-digit phone number, without country code' }),
    (0, class_validator_1.ValidateIf)((dto) => dto.phone !== undefined || dto.countryCode !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(phone_constant_1.LOCAL_PHONE_PATTERN, { message: phone_constant_1.LOCAL_PHONE_MESSAGE }),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Account manager user UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "accountManagerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '29ABCDE1234F1Z5' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toUpperCase()),
    (0, class_validator_1.Matches)(gst_constant_1.GST_NUMBER_PATTERN, { message: gst_constant_1.GST_NUMBER_MESSAGE }),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "gstNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123 MG Road, Mumbai, Maharashtra 400001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "billingAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Asia/Kolkata', default: 'Asia/Kolkata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Created manually by admin.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Package UUID to assign immediately' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "packageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.SubscriptionIntervalEnum, default: 'MONTHLY' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SubscriptionIntervalEnum),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 15000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateClientWithPlanDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'INR', default: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Subscription period start date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateClientWithPlanDto.prototype, "currentPeriodStart", void 0);
//# sourceMappingURL=create-client-with-plan.dto.js.map
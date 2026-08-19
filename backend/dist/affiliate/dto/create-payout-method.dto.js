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
exports.PreparePaymentEmployeeDto = exports.UpdatePayoutMethodDto = exports.CreatePayoutMethodDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
/**
 * NOTE: full account numbers / UPI handles are never persisted. The service layer
 * derives `maskedDetails` + `last4` and hands the sensitive values straight to
 * RazorpayX for fund-account creation.
 */
class CreatePayoutMethodDto {
    type;
    accountNumber;
    ifsc;
    accountHolderName;
    upiId;
    isDefault;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: ["BANK_ACCOUNT", "UPI"] }, accountNumber: { required: false, type: () => String, maxLength: 32 }, ifsc: { required: false, type: () => String, maxLength: 16 }, accountHolderName: { required: false, type: () => String, maxLength: 120 }, upiId: { required: false, type: () => String, maxLength: 120, pattern: "^[\\w.\\-]{2,64}@[a-zA-Z]{2,64}$" }, isDefault: { required: false, type: () => Boolean } };
    }
}
exports.CreatePayoutMethodDto = CreatePayoutMethodDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PayoutMethodTypeEnum }),
    (0, class_validator_1.IsEnum)(client_1.PayoutMethodTypeEnum),
    __metadata("design:type", String)
], CreatePayoutMethodDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bank account number (BANK_ACCOUNT only) — never stored in full' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], CreatePayoutMethodDto.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IFSC code (BANK_ACCOUNT only)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(16),
    __metadata("design:type", String)
], CreatePayoutMethodDto.prototype, "ifsc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Account holder name (BANK_ACCOUNT only)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreatePayoutMethodDto.prototype, "accountHolderName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UPI VPA (UPI only) — never stored in full', example: 'name@bank' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    (0, class_validator_1.Matches)(/^[\w.\-]{2,64}@[a-zA-Z]{2,64}$/, { message: 'upiId must be a valid UPI VPA' }),
    __metadata("design:type", String)
], CreatePayoutMethodDto.prototype, "upiId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mark this method as the default payout destination' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePayoutMethodDto.prototype, "isDefault", void 0);
class UpdatePayoutMethodDto {
    isDefault;
    disabled;
    static _OPENAPI_METADATA_FACTORY() {
        return { isDefault: { required: false, type: () => Boolean }, disabled: { required: false, type: () => Boolean } };
    }
}
exports.UpdatePayoutMethodDto = UpdatePayoutMethodDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mark this method as the default payout destination' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePayoutMethodDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Disable this payout method' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePayoutMethodDto.prototype, "disabled", void 0);
class PreparePaymentEmployeeDto {
    employeeCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { employeeCode: { required: true, type: () => String } };
    }
}
exports.PreparePaymentEmployeeDto = PreparePaymentEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Employee code applied to this checkout', example: 'EMP-7K2QX' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PreparePaymentEmployeeDto.prototype, "employeeCode", void 0);
//# sourceMappingURL=create-payout-method.dto.js.map
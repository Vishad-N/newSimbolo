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
exports.UpdateAffiliateSettingsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class UpdateAffiliateSettingsDto {
    defaultCommissionRate;
    commissionCalculationBasis;
    commissionHoldPeriodDays;
    minimumWithdrawalAmount;
    maximumWithdrawalAmount;
    paydayFrequency;
    paydayDayOfWeek;
    paydayCutoffTime;
    payoutAutoProcessingEnabled;
    selfReferralAllowed;
    static _OPENAPI_METADATA_FACTORY() {
        return { defaultCommissionRate: { required: false, type: () => Number, minimum: 0, maximum: 100 }, commissionCalculationBasis: { required: false, enum: ["SUBTOTAL", "SUBTOTAL_AFTER_DISCOUNT", "TAXABLE_AMOUNT", "GRAND_TOTAL"] }, commissionHoldPeriodDays: { required: false, type: () => Number, minimum: 0, maximum: 365 }, minimumWithdrawalAmount: { required: false, type: () => Number, minimum: 0 }, maximumWithdrawalAmount: { required: false, type: () => Number, minimum: 0 }, paydayFrequency: { required: false, type: () => String }, paydayDayOfWeek: { required: false, type: () => Number, minimum: 0, maximum: 6 }, paydayCutoffTime: { required: false, type: () => String, pattern: "^([01]\\d|2[0-3]):[0-5]\\d$" }, payoutAutoProcessingEnabled: { required: false, type: () => Boolean }, selfReferralAllowed: { required: false, type: () => Boolean } };
    }
}
exports.UpdateAffiliateSettingsDto = UpdateAffiliateSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default commission percentage applied to new affiliates', example: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateAffiliateSettingsDto.prototype, "defaultCommissionRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.CommissionCalculationBasisEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CommissionCalculationBasisEnum),
    __metadata("design:type", String)
], UpdateAffiliateSettingsDto.prototype, "commissionCalculationBasis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Days a commission stays PENDING before becoming ELIGIBLE', example: 7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], UpdateAffiliateSettingsDto.prototype, "commissionHoldPeriodDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateAffiliateSettingsDto.prototype, "minimumWithdrawalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 200000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateAffiliateSettingsDto.prototype, "maximumWithdrawalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'WEEKLY' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAffiliateSettingsDto.prototype, "paydayFrequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '0 = Sunday … 6 = Saturday', example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], UpdateAffiliateSettingsDto.prototype, "paydayDayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '17:00' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'paydayCutoffTime must be HH:mm' }),
    __metadata("design:type", String)
], UpdateAffiliateSettingsDto.prototype, "paydayCutoffTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAffiliateSettingsDto.prototype, "payoutAutoProcessingEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Allow an employee to use their own code on their own purchase' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAffiliateSettingsDto.prototype, "selfReferralAllowed", void 0);
//# sourceMappingURL=update-affiliate-settings.dto.js.map
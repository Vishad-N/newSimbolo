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
exports.WithdrawalActionDto = exports.RequestWithdrawalDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RequestWithdrawalDto {
    amount;
    payoutMethodId;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 1 }, payoutMethodId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.RequestWithdrawalDto = RequestWithdrawalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount in rupees to withdraw from the available wallet balance', example: 1500 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], RequestWithdrawalDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payout method to use. Defaults to the affiliate default method.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RequestWithdrawalDto.prototype, "payoutMethodId", void 0);
class WithdrawalActionDto {
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.WithdrawalActionDto = WithdrawalActionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason / note recorded on the audit trail' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], WithdrawalActionDto.prototype, "reason", void 0);
//# sourceMappingURL=request-withdrawal.dto.js.map
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
exports.UpdateSubscriptionDto = exports.CreateSubscriptionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateSubscriptionDto {
    clientId;
    packageId;
    interval;
    price;
    currency;
    currentPeriodStart;
    razorpaySubscriptionId;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: true, type: () => String }, packageId: { required: true, type: () => String }, interval: { required: false, enum: ["MONTHLY", "QUARTERLY", "ANNUALLY"] }, price: { required: true, type: () => Number, minimum: 1 }, currency: { required: false, type: () => String }, currentPeriodStart: { required: false, type: () => String }, razorpaySubscriptionId: { required: false, type: () => String } };
    }
}
exports.CreateSubscriptionDto = CreateSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client profile ID', example: 'uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Package ID being subscribed to', example: 'uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "packageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.SubscriptionIntervalEnum, default: 'MONTHLY' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SubscriptionIntervalEnum),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subscription price per interval', example: 15000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', default: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trial period start date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "currentPeriodStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Razorpay subscription ID if applicable' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "razorpaySubscriptionId", void 0);
class UpdateSubscriptionDto {
    status;
    packageId;
    price;
    cancelAtPeriodEnd;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: ["ACTIVE", "PAUSED", "CANCELED", "PAST_DUE", "TRIALING", "UNPAID"] }, packageId: { required: false, type: () => String }, price: { required: false, type: () => Number, minimum: 1 }, cancelAtPeriodEnd: { required: false, type: () => Boolean } };
    }
}
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.SubscriptionStatusEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SubscriptionStatusEnum),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New package ID for upgrade/downgrade' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "packageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New price after upgrade/downgrade' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateSubscriptionDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Set to cancel at end of current period' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "cancelAtPeriodEnd", void 0);
//# sourceMappingURL=subscription.dto.js.map
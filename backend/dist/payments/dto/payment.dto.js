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
exports.VerifyPaymentDto = exports.CreatePaymentOrderDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePaymentOrderDto {
    orderId;
    currency = 'INR';
    /**
     * Optional sales-employee attribution code. It is re-validated server-side here —
     * a prior /checkout/affiliate/validate call is never trusted, and no "already
     * validated" flag from the client is accepted. An invalid code aborts the request
     * before any gateway call is made.
     */
    employeeCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { orderId: { required: true, type: () => String }, currency: { required: false, type: () => String, default: "INR" }, employeeCode: { required: false, type: () => String, description: "Optional sales-employee attribution code. It is re-validated server-side here \u2014\na prior /checkout/affiliate/validate call is never trusted, and no \"already\nvalidated\" flag from the client is accepted. An invalid code aborts the request\nbefore any gateway call is made." } };
    }
}
exports.CreatePaymentOrderDto = CreatePaymentOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Internal order ID to create gateway order for', example: 'uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', default: 'INR', example: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sales employee code applied at checkout', example: 'EMP-7K2QX' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "employeeCode", void 0);
class VerifyPaymentDto {
    razorpayOrderId;
    razorpayPaymentId;
    razorpaySignature;
    static _OPENAPI_METADATA_FACTORY() {
        return { razorpayOrderId: { required: true, type: () => String }, razorpayPaymentId: { required: true, type: () => String }, razorpaySignature: { required: true, type: () => String } };
    }
}
exports.VerifyPaymentDto = VerifyPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Razorpay order ID from gateway', example: 'order_ABC123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyPaymentDto.prototype, "razorpayOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Razorpay payment ID from gateway', example: 'pay_XYZ789' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyPaymentDto.prototype, "razorpayPaymentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'HMAC-SHA256 signature from Razorpay callback', example: 'abc123...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyPaymentDto.prototype, "razorpaySignature", void 0);
//# sourceMappingURL=payment.dto.js.map
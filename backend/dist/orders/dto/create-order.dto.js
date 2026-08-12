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
exports.CreateOrderDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateOrderDto {
    clientId;
    packageId;
    serviceId;
    totalAmount;
    taxAmount;
    discountAmount;
    netAmount;
    currency;
    notes;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: true, type: () => String, format: "uuid" }, packageId: { required: false, type: () => String, format: "uuid" }, serviceId: { required: false, type: () => String, format: "uuid" }, totalAmount: { required: true, type: () => Number, minimum: 0 }, taxAmount: { required: false, type: () => Number, minimum: 0 }, discountAmount: { required: false, type: () => Number, minimum: 0 }, netAmount: { required: true, type: () => Number, minimum: 0 }, currency: { required: false, type: () => String }, notes: { required: false, type: () => String }, status: { required: false, enum: ["ACTIVE", "DRAFT", "PENDING", "PENDING_PAYMENT", "CONFIRMED", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED", "CANCELLED", "REFUNDED"] } };
    }
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Client profile UUID' }),
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'c0a80123-4567-89ab-cdef-0123456789ab',
        description: 'Package UUID (optional if service items specified)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "packageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, description: 'Total order amount before tax and discounts' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 9000, default: 0, description: 'Tax amount (18% GST etc.)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5000, default: 0, description: 'Discount amount applied' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 54000, description: 'Net payable amount (totalAmount + taxAmount - discountAmount)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "netAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'INR', default: 'INR', description: 'Currency code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Priority onboarding requested. Deadline: 15th Aug.',
        description: 'Internal order notes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.OrderStatusEnum,
        default: client_1.OrderStatusEnum.PENDING_PAYMENT,
        description: 'Initial order status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatusEnum),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "status", void 0);
//# sourceMappingURL=create-order.dto.js.map
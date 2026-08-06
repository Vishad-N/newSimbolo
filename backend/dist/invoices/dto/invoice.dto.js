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
exports.UpdateInvoiceStatusDto = exports.CreateInvoiceDto = exports.InvoiceItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class InvoiceItemDto {
    name;
    description;
    quantity;
    unitPrice;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: false, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, unitPrice: { required: true, type: () => Number, minimum: 1 } };
    }
}
exports.InvoiceItemDto = InvoiceItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item name', example: 'SEO Retainer - Professional Plan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Item description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvoiceItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], InvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit price', example: 15000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], InvoiceItemDto.prototype, "unitPrice", void 0);
class CreateInvoiceDto {
    clientId;
    orderId;
    subscriptionId;
    dueDate;
    items;
    taxPercentage;
    currency;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: true, type: () => String }, orderId: { required: false, type: () => String }, subscriptionId: { required: false, type: () => String }, dueDate: { required: true, type: () => String }, items: { required: true, type: () => [require("./invoice.dto").InvoiceItemDto] }, taxPercentage: { required: false, type: () => Number, minimum: 0 }, currency: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client profile ID', example: 'uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order ID to associate the invoice with', example: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Subscription ID to associate the invoice with', example: 'uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "subscriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice due date', example: '2026-02-28T00:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Line items', type: [InvoiceItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InvoiceItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tax percentage', default: 18, example: 18 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "taxPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', default: 'INR', example: 'INR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes on the invoice' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
class UpdateInvoiceStatusDto {
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, enum: ["DRAFT", "CANCELLED", "SENT", "PAID", "OVERDUE"] } };
    }
}
exports.UpdateInvoiceStatusDto = UpdateInvoiceStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.InvoiceStatusEnum, description: 'New invoice status' }),
    (0, class_validator_1.IsEnum)(client_1.InvoiceStatusEnum),
    __metadata("design:type", String)
], UpdateInvoiceStatusDto.prototype, "status", void 0);
//# sourceMappingURL=invoice.dto.js.map
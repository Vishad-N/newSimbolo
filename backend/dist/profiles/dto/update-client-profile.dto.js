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
exports.UpdateClientProfileDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateClientProfileDto {
    gstNumber;
    billingAddress;
    timezone;
    companyId;
    static _OPENAPI_METADATA_FACTORY() {
        return { gstNumber: { required: false, type: () => String }, billingAddress: { required: false, type: () => String }, timezone: { required: false, type: () => String }, companyId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.UpdateClientProfileDto = UpdateClientProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '29ABCDE1234F1Z5', description: 'GST identification number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientProfileDto.prototype, "gstNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123 Tech Park, Bangalore, India', description: 'Billing address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientProfileDto.prototype, "billingAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Asia/Kolkata', description: 'User preferred timezone' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClientProfileDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-company-id', description: 'Associated company UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], UpdateClientProfileDto.prototype, "companyId", void 0);
//# sourceMappingURL=update-client-profile.dto.js.map
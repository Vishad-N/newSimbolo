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
exports.ServicePageConfigDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ServicePageConfigDto {
    heroBenefits;
    statsBar;
    servicesList;
    resultMetrics;
    static _OPENAPI_METADATA_FACTORY() {
        return { heroBenefits: { required: false, type: () => [String] }, statsBar: { required: false, type: () => [Object] }, servicesList: { required: false, type: () => [Object] }, resultMetrics: { required: false, type: () => [Object] } };
    }
}
exports.ServicePageConfigDto = ServicePageConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ServicePageConfigDto.prototype, "heroBenefits", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ServicePageConfigDto.prototype, "statsBar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ServicePageConfigDto.prototype, "servicesList", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ServicePageConfigDto.prototype, "resultMetrics", void 0);
//# sourceMappingURL=service-page-config.dto.js.map
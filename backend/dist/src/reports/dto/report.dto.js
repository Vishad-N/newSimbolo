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
exports.GenerateReportDto = exports.ReportType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ReportType;
(function (ReportType) {
    ReportType["REVENUE"] = "REVENUE";
    ReportType["CLIENTS"] = "CLIENTS";
    ReportType["PROJECTS"] = "PROJECTS";
    ReportType["ORDERS"] = "ORDERS";
    ReportType["PAYMENTS"] = "PAYMENTS";
    ReportType["TEAM_PERFORMANCE"] = "TEAM_PERFORMANCE";
    ReportType["MARKETING_PERFORMANCE"] = "MARKETING_PERFORMANCE";
    ReportType["SUPPORT_TICKETS"] = "SUPPORT_TICKETS";
    ReportType["CONTENT_PERFORMANCE"] = "CONTENT_PERFORMANCE";
    ReportType["WEBSITE_ANALYTICS"] = "WEBSITE_ANALYTICS";
})(ReportType || (exports.ReportType = ReportType = {}));
class GenerateReportDto {
    type;
    startDate;
    endDate;
    groupBy;
    sortBy;
    sortDirection;
    filters;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("./report.dto").ReportType }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, groupBy: { required: false, type: () => String }, sortBy: { required: false, type: () => String }, sortDirection: { required: false, enum: ["asc", "desc"] }, filters: { required: false, type: "object", additionalProperties: true } };
    }
}
exports.GenerateReportDto = GenerateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReportType }),
    (0, class_validator_1.IsEnum)(ReportType),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-01-01T00:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-12-31T23:59:59.999Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "groupBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'createdAt' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'desc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "sortDirection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { status: 'ACTIVE' } }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], GenerateReportDto.prototype, "filters", void 0);
//# sourceMappingURL=report.dto.js.map
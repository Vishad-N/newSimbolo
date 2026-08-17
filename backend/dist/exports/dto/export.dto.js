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
exports.ExportReportDto = exports.ExportFormat = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const report_dto_1 = require("../../reports/dto/report.dto");
var ExportFormat;
(function (ExportFormat) {
    ExportFormat["PDF"] = "PDF";
    ExportFormat["CSV"] = "CSV";
    ExportFormat["EXCEL"] = "EXCEL";
})(ExportFormat || (exports.ExportFormat = ExportFormat = {}));
class ExportReportDto {
    format;
    report;
    static _OPENAPI_METADATA_FACTORY() {
        return { format: { required: true, enum: require("./export.dto").ExportFormat }, report: { required: true, type: () => require("../../reports/dto/report.dto").GenerateReportDto } };
    }
}
exports.ExportReportDto = ExportReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExportFormat }),
    (0, class_validator_1.IsEnum)(ExportFormat),
    __metadata("design:type", String)
], ExportReportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: report_dto_1.GenerateReportDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => report_dto_1.GenerateReportDto),
    __metadata("design:type", report_dto_1.GenerateReportDto)
], ExportReportDto.prototype, "report", void 0);
//# sourceMappingURL=export.dto.js.map
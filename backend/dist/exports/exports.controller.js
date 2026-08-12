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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const reports_service_1 = require("../reports/reports.service");
const export_dto_1 = require("./dto/export.dto");
const exports_service_1 = require("./exports.service");
let ExportsController = class ExportsController {
    reportsService;
    exportsService;
    constructor(reportsService, exportsService) {
        this.reportsService = reportsService;
        this.exportsService = exportsService;
    }
    async exportReport(dto, response) {
        const report = await this.reportsService.generate(dto.report);
        const exportedFile = await this.exportsService.exportReport(report, dto.format);
        response.set({
            'Content-Type': exportedFile.mimeType,
            'Content-Disposition': `attachment; filename="${exportedFile.filename}"`,
            'Content-Length': exportedFile.buffer.length,
        });
        response.end(exportedFile.buffer);
    }
};
exports.ExportsController = ExportsController;
__decorate([
    (0, common_1.Post)('reports'),
    (0, permissions_decorator_1.Permissions)('reports.export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export a generated report as PDF, CSV, or Excel-compatible spreadsheet' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_dto_1.ExportReportDto, Object]),
    __metadata("design:returntype", Promise)
], ExportsController.prototype, "exportReport", null);
exports.ExportsController = ExportsController = __decorate([
    (0, swagger_1.ApiTags)('Exports'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('exports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        exports_service_1.ExportsService])
], ExportsController);
//# sourceMappingURL=exports.controller.js.map
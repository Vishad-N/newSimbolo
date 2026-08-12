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
exports.ExportsService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const base_service_1 = require("../shared/abstractions/base.service");
const export_dto_1 = require("./dto/export.dto");
let ExportsService = class ExportsService extends base_service_1.BaseService {
    constructor() {
        super('ExportsService');
    }
    async exportReport(report, format) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const baseName = `${report.type.toLowerCase()}-${timestamp}`;
        if (format === export_dto_1.ExportFormat.CSV) {
            return {
                buffer: Buffer.from(this.toCsv(report), 'utf8'),
                mimeType: 'text/csv',
                filename: `${baseName}.csv`,
            };
        }
        if (format === export_dto_1.ExportFormat.EXCEL) {
            return {
                buffer: Buffer.from(this.toExcelXml(report), 'utf8'),
                mimeType: 'application/vnd.ms-excel',
                filename: `${baseName}.xls`,
            };
        }
        return {
            buffer: await this.toPdf(report),
            mimeType: 'application/pdf',
            filename: `${baseName}.pdf`,
        };
    }
    toCsv(report) {
        const metadata = [
            ['The Simbolo'],
            [report.title],
            [`Date Generated: ${report.generatedAt}`],
            [`Filters Applied: ${JSON.stringify(report.filtersApplied)}`],
            [],
        ];
        const rows = [
            ...metadata,
            report.columns,
            ...report.rows.map((row) => report.columns.map((column) => this.escapeCsv(row[column]))),
            [],
            ['Totals'],
            ...Object.entries(report.totals).map(([key, value]) => [key, String(value)]),
        ];
        return rows.map((row) => row.join(',')).join('\n');
    }
    escapeCsv(value) {
        const rawValue = value === null || value === undefined ? '' : String(value);
        return `"${rawValue.replace(/"/g, '""')}"`;
    }
    toExcelXml(report) {
        const rows = [
            ['The Simbolo'],
            [report.title],
            [`Date Generated: ${report.generatedAt}`],
            [`Filters Applied: ${JSON.stringify(report.filtersApplied)}`],
            [],
            report.columns,
            ...report.rows.map((row) => report.columns.map((column) => row[column] ?? '')),
            [],
            ['Totals'],
            ...Object.entries(report.totals),
        ];
        const tableRows = rows
            .map((row) => {
            const cells = row
                .map((value) => `<Cell><Data ss:Type="String">${this.escapeXml(String(value))}</Data></Cell>`)
                .join('');
            return `<Row>${cells}</Row>`;
        })
            .join('');
        return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Report"><Table>${tableRows}</Table></Worksheet>
</Workbook>`;
    }
    escapeXml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    async toPdf(report) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 48, size: 'A4' });
            const buffers = [];
            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            doc.font('Helvetica-Bold').fontSize(18).text('The Simbolo', { continued: false });
            doc.fontSize(14).text(report.title);
            doc.font('Helvetica').fontSize(9).text(`Date Generated: ${report.generatedAt}`);
            doc.text(`Filters Applied: ${JSON.stringify(report.filtersApplied)}`);
            doc.moveDown();
            doc.font('Helvetica-Bold').fontSize(8).text(report.columns.join(' | '));
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(8);
            for (const row of report.rows.slice(0, 100)) {
                doc.text(report.columns.map((column) => String(row[column] ?? '')).join(' | '), {
                    width: 500,
                });
            }
            doc.moveDown();
            doc.font('Helvetica-Bold').text('Totals');
            for (const [key, value] of Object.entries(report.totals)) {
                doc.font('Helvetica').text(`${key}: ${value}`);
            }
            doc.end();
        });
    }
};
exports.ExportsService = ExportsService;
exports.ExportsService = ExportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ExportsService);
//# sourceMappingURL=exports.service.js.map
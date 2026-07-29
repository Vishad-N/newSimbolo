"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const report_dto_1 = require("../reports/dto/report.dto");
const export_dto_1 = require("./dto/export.dto");
const exports_service_1 = require("./exports.service");
describe('ExportsService', () => {
    it('exports report data as branded CSV', async () => {
        const service = new exports_service_1.ExportsService();
        const exported = await service.exportReport({
            type: report_dto_1.ReportType.REVENUE,
            title: 'Revenue Report',
            generatedAt: '2026-07-28T00:00:00.000Z',
            filtersApplied: { status: 'SUCCESSFUL' },
            columns: ['paymentNumber', 'amount'],
            rows: [{ paymentNumber: 'PAY-1', amount: 1000 }],
            totals: { totalRevenue: 1000 },
        }, export_dto_1.ExportFormat.CSV);
        expect(exported.mimeType).toBe('text/csv');
        expect(exported.buffer.toString('utf8')).toContain('The Simbolo');
        expect(exported.buffer.toString('utf8')).toContain('"PAY-1","1000"');
    });
});
//# sourceMappingURL=exports.service.spec.js.map
import { ReportType } from '../reports/dto/report.dto';
import { ExportFormat } from './dto/export.dto';
import { ExportsService } from './exports.service';

describe('ExportsService', () => {
  it('exports report data as branded CSV', async () => {
    const service = new ExportsService();
    const exported = await service.exportReport(
      {
        type: ReportType.REVENUE,
        title: 'Revenue Report',
        generatedAt: '2026-07-28T00:00:00.000Z',
        filtersApplied: { status: 'SUCCESSFUL' },
        columns: ['paymentNumber', 'amount'],
        rows: [{ paymentNumber: 'PAY-1', amount: 1000 }],
        totals: { totalRevenue: 1000 },
      },
      ExportFormat.CSV,
    );

    expect(exported.mimeType).toBe('text/csv');
    expect(exported.buffer.toString('utf8')).toContain('The Simbolo');
    expect(exported.buffer.toString('utf8')).toContain('"PAY-1","1000"');
  });
});

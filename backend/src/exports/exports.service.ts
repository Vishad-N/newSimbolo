import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { ReportResult } from '../reports/dto/report.dto';
import { BaseService } from '../shared/abstractions/base.service';
import { ExportFormat } from './dto/export.dto';

export interface ExportedFile {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

@Injectable()
export class ExportsService extends BaseService {
  constructor() {
    super('ExportsService');
  }

  async exportReport(report: ReportResult, format: ExportFormat): Promise<ExportedFile> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = `${report.type.toLowerCase()}-${timestamp}`;

    if (format === ExportFormat.CSV) {
      return {
        buffer: Buffer.from(this.toCsv(report), 'utf8'),
        mimeType: 'text/csv',
        filename: `${baseName}.csv`,
      };
    }

    if (format === ExportFormat.EXCEL) {
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

  private toCsv(report: ReportResult): string {
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

  private escapeCsv(value: string | number | boolean | null | undefined): string {
    const rawValue = value === null || value === undefined ? '' : String(value);
    return `"${rawValue.replace(/"/g, '""')}"`;
  }

  private toExcelXml(report: ReportResult): string {
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

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private async toPdf(report: ReportResult): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 48, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
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
}

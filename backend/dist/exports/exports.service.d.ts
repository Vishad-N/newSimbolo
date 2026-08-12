import { ReportResult } from '../reports/dto/report.dto';
import { BaseService } from '../shared/abstractions/base.service';
import { ExportFormat } from './dto/export.dto';
export interface ExportedFile {
    buffer: Buffer;
    mimeType: string;
    filename: string;
}
export declare class ExportsService extends BaseService {
    constructor();
    exportReport(report: ReportResult, format: ExportFormat): Promise<ExportedFile>;
    private toCsv;
    private escapeCsv;
    private toExcelXml;
    private escapeXml;
    private toPdf;
}

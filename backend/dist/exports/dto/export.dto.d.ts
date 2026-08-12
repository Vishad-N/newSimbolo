import { GenerateReportDto } from '../../reports/dto/report.dto';
export declare enum ExportFormat {
    PDF = "PDF",
    CSV = "CSV",
    EXCEL = "EXCEL"
}
export declare class ExportReportDto {
    format: ExportFormat;
    report: GenerateReportDto;
}

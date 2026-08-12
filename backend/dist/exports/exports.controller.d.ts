import { Response } from 'express';
import { ReportsService } from '../reports/reports.service';
import { ExportReportDto } from './dto/export.dto';
import { ExportsService } from './exports.service';
export declare class ExportsController {
    private readonly reportsService;
    private readonly exportsService;
    constructor(reportsService: ReportsService, exportsService: ExportsService);
    exportReport(dto: ExportReportDto, response: Response): Promise<void>;
}

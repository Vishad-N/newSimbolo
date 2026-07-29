import { GenerateReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generate(dto: GenerateReportDto): Promise<import("./dto/report.dto").ReportResult>;
}

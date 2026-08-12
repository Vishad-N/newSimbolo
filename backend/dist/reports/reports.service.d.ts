import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { GenerateReportDto, ReportResult } from './dto/report.dto';
export declare class ReportsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private createdAtWhere;
    generate(dto: GenerateReportDto): Promise<ReportResult>;
    private buildReport;
    private generateRevenueReport;
    private generateClientsReport;
    private generateProjectsReport;
    private generateOrdersReport;
    private generatePaymentsReport;
    private generateTeamReport;
    private generateMarketingReport;
    private generateSupportReport;
    private generateContentReport;
    private generateWebsiteReport;
}

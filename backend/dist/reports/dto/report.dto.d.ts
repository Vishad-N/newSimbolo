export declare enum ReportType {
    REVENUE = "REVENUE",
    CLIENTS = "CLIENTS",
    PROJECTS = "PROJECTS",
    ORDERS = "ORDERS",
    PAYMENTS = "PAYMENTS",
    TEAM_PERFORMANCE = "TEAM_PERFORMANCE",
    MARKETING_PERFORMANCE = "MARKETING_PERFORMANCE",
    SUPPORT_TICKETS = "SUPPORT_TICKETS",
    CONTENT_PERFORMANCE = "CONTENT_PERFORMANCE",
    WEBSITE_ANALYTICS = "WEBSITE_ANALYTICS"
}
export declare class GenerateReportDto {
    type: ReportType;
    startDate?: string;
    endDate?: string;
    groupBy?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    filters?: Record<string, string | number | boolean>;
}
export interface ReportResult {
    type: ReportType;
    title: string;
    generatedAt: string;
    filtersApplied: Record<string, string | number | boolean | undefined>;
    columns: string[];
    rows: Record<string, string | number | boolean | null>[];
    totals: Record<string, number>;
}

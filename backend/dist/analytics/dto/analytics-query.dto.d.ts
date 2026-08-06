export declare enum SortDirection {
    ASC = "asc",
    DESC = "desc"
}
export declare class AnalyticsQueryDto {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: SortDirection;
}

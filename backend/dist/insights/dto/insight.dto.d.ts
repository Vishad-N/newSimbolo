export declare enum InsightCategory {
    REVENUE = "REVENUE",
    CLIENT = "CLIENT",
    PROJECT = "PROJECT",
    TEAM = "TEAM",
    PAYMENT = "PAYMENT",
    CONTENT = "CONTENT",
    SERVICE = "SERVICE"
}
export declare class InsightQueryDto {
    category?: InsightCategory;
}
export interface BusinessInsight {
    id: string;
    category: InsightCategory;
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    metric?: number;
    generatedAt: string;
}

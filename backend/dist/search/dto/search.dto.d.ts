export declare class SearchQueryDto {
    q: string;
    entities?: string[];
    page?: number;
    limit?: number;
}
export interface SearchResultItem {
    entity: string;
    id: string;
    title: string;
    subtitle?: string | null;
    url?: string;
    score: number;
}

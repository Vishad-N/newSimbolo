export declare class PaginatedMetaDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export declare class PaginatedResponseDto<T> {
    items: T[];
    meta: PaginatedMetaDto;
}

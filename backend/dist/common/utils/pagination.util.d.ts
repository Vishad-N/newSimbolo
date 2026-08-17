import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
export declare class PaginationUtil {
    static getPrismaParameters(query: PaginationQueryDto): {
        skip: number;
        take: number;
        page: number;
        limit: number;
    };
    static createPaginatedResponse<T>(items: T[], totalItems: number, page: number, limit: number): PaginatedResponseDto<T>;
}

import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedMetaDto, PaginatedResponseDto } from '../dto/paginated-response.dto';
import { APP_CONSTANTS } from '../constants/app.constants';

export class PaginationUtil {
  static getPrismaParameters(query: PaginationQueryDto) {
    const page = query.page && query.page > 0 ? query.page : APP_CONSTANTS.DEFAULT_PAGE;
    const limit =
      query.limit && query.limit > 0 ? Math.min(query.limit, APP_CONSTANTS.MAX_LIMIT) : APP_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
      page,
      limit,
    };
  }

  static createPaginatedResponse<T>(
    items: T[],
    totalItems: number,
    page: number,
    limit: number,
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const meta: PaginatedMetaDto = {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };

    return {
      items,
      meta,
    };
  }
}

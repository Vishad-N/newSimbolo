import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaDto {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ example: 100, description: 'Total items matching query' })
  totalItems: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Indicates if there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Indicates if there is a previous page' })
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of paginated items' })
  items: T[];

  @ApiProperty({ type: PaginatedMetaDto, description: 'Pagination metadata' })
  meta: PaginatedMetaDto;
}

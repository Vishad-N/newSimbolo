import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum ReportType {
  REVENUE = 'REVENUE',
  CLIENTS = 'CLIENTS',
  PROJECTS = 'PROJECTS',
  ORDERS = 'ORDERS',
  PAYMENTS = 'PAYMENTS',
  TEAM_PERFORMANCE = 'TEAM_PERFORMANCE',
  MARKETING_PERFORMANCE = 'MARKETING_PERFORMANCE',
  SUPPORT_TICKETS = 'SUPPORT_TICKETS',
  CONTENT_PERFORMANCE = 'CONTENT_PERFORMANCE',
  WEBSITE_ANALYTICS = 'WEBSITE_ANALYTICS',
}

export class GenerateReportDto {
  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'status' })
  @IsOptional()
  @IsString()
  groupBy?: string;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc' })
  @IsOptional()
  @IsString()
  sortDirection?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: { status: 'ACTIVE' } })
  @IsOptional()
  @IsObject()
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

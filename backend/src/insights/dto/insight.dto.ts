import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum InsightCategory {
  REVENUE = 'REVENUE',
  CLIENT = 'CLIENT',
  PROJECT = 'PROJECT',
  TEAM = 'TEAM',
  PAYMENT = 'PAYMENT',
  CONTENT = 'CONTENT',
  SERVICE = 'SERVICE',
}

export class InsightQueryDto {
  @ApiPropertyOptional({ enum: InsightCategory })
  @IsOptional()
  @IsEnum(InsightCategory)
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

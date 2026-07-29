import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { MilestoneStatusEnum } from '@prisma/client';

export class CreateMilestoneDto {
  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' })
  @IsUUID('4')
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({ example: 'Phase 1: Discovery & Research', description: 'Milestone title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'Complete stakeholder interviews, competitive analysis, and sitemap.',
    description: 'Milestone description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-08-15T00:00:00.000Z', description: 'Due date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    example: 'c0a80123-4567-89ab-cdef-0123456789ab',
    description: 'Milestone UUID this one depends on',
  })
  @IsOptional()
  @IsUUID('4')
  dependsOnId?: string;

  @ApiPropertyOptional({ example: 1, default: 0, description: 'Sort order for display' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

export class UpdateMilestoneDto {
  @ApiPropertyOptional({ example: 'Phase 1: Discovery & Analysis', description: 'Milestone title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Milestone description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-08-15T00:00:00.000Z', description: 'Due date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: '2026-08-12T00:00:00.000Z', description: 'Completion date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  completedDate?: string;

  @ApiPropertyOptional({ enum: MilestoneStatusEnum, description: 'Milestone status' })
  @IsOptional()
  @IsEnum(MilestoneStatusEnum)
  status?: MilestoneStatusEnum;

  @ApiPropertyOptional({ example: 1, description: 'Sort order for display' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Dependency milestone UUID' })
  @IsOptional()
  @IsUUID('4')
  dependsOnId?: string;
}

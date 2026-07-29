import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ProjectStatusEnum, ProjectPriorityEnum } from '@prisma/client';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Acme Corp Website Redesign v2', description: 'Project name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project manager User UUID' })
  @IsOptional()
  @IsUUID('4')
  managerId?: string;

  @ApiPropertyOptional({ enum: ProjectStatusEnum, description: 'Project status' })
  @IsOptional()
  @IsEnum(ProjectStatusEnum)
  status?: ProjectStatusEnum;

  @ApiPropertyOptional({ enum: ProjectPriorityEnum, description: 'Project priority' })
  @IsOptional()
  @IsEnum(ProjectPriorityEnum)
  priority?: ProjectPriorityEnum;

  @ApiPropertyOptional({ example: 120000, description: 'Project budget' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({ example: 65, description: 'Overall project completion percentage (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: '2026-08-01T00:00:00.000Z', description: 'Project start date (ISO 8601)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-10-31T00:00:00.000Z', description: 'Target end date (ISO 8601)' })
  @IsOptional()
  @IsString()
  targetEndDate?: string;

  @ApiPropertyOptional({ example: '2026-10-15T00:00:00.000Z', description: 'Actual end date (ISO 8601)' })
  @IsOptional()
  @IsString()
  actualEndDate?: string;
}

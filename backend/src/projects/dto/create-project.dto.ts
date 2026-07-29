import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ProjectStatusEnum, ProjectPriorityEnum } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ example: 'Acme Corp Website Redesign', description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Full website redesign and SEO optimization for Acme Corp',
    description: 'Project description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Order UUID this project belongs to' })
  @IsUUID('4')
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Client profile UUID' })
  @IsUUID('4')
  @IsNotEmpty()
  clientId!: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project manager User UUID' })
  @IsOptional()
  @IsUUID('4')
  managerId?: string;

  @ApiPropertyOptional({
    enum: ProjectStatusEnum,
    default: ProjectStatusEnum.PLANNING,
    description: 'Initial project status',
  })
  @IsOptional()
  @IsEnum(ProjectStatusEnum)
  status?: ProjectStatusEnum;

  @ApiPropertyOptional({
    enum: ProjectPriorityEnum,
    default: ProjectPriorityEnum.MEDIUM,
    description: 'Project priority',
  })
  @IsOptional()
  @IsEnum(ProjectPriorityEnum)
  priority?: ProjectPriorityEnum;

  @ApiPropertyOptional({ example: 120000, description: 'Project budget in base currency' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({ example: '2026-08-01T00:00:00.000Z', description: 'Project start date (ISO 8601)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-10-31T00:00:00.000Z', description: 'Target end date (ISO 8601)' })
  @IsOptional()
  @IsString()
  targetEndDate?: string;
}

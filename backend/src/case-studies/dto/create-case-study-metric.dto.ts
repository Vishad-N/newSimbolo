import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCaseStudyMetricDto {
  @ApiProperty({ example: 'Organic Search Traffic', description: 'Metric KPI label' })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({ example: '250,000 / mo', description: 'Metric value achieved' })
  @IsString()
  @IsNotEmpty()
  value!: string;

  @ApiPropertyOptional({ example: '+400%', description: 'Percentage growth change' })
  @IsOptional()
  @IsString()
  changePercentage?: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'CaseStudy UUID' })
  @IsUUID('4')
  caseStudyId!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

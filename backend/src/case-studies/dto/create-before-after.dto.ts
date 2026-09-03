import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBeforeAfterDto {
  @ApiPropertyOptional({ example: 'Homepage Redesign Visual Transformation', description: 'Comparison title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Before: outdated layout vs After: high-converting design',
    description: 'Description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Organic Traffic', description: 'The stat/metric being compared (rendered as the card heading)' })
  @IsOptional()
  @IsString()
  metric?: string;

  @ApiPropertyOptional({ example: '500 / mo', description: 'Value before the engagement' })
  @IsOptional()
  @IsString()
  beforeValue?: string;

  @ApiPropertyOptional({ example: '5,000 / mo', description: 'Value after the engagement' })
  @IsOptional()
  @IsString()
  afterValue?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Before image MediaAsset UUID (optional visual slider)' })
  @IsOptional()
  @IsUUID('4')
  beforeImageId?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'After image MediaAsset UUID (optional visual slider)' })
  @IsOptional()
  @IsUUID('4')
  afterImageId?: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'CaseStudy UUID' })
  @IsUUID('4')
  caseStudyId!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

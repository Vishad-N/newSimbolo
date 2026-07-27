import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateServiceFeatureDto {
  @ApiProperty({ example: 'Keyword Research & Competitor Mapping', description: 'Feature title' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'In-depth analysis of high-intent search queries', description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Parent Service UUID' })
  @IsUUID('4')
  serviceId!: string;

  @ApiPropertyOptional({ example: true, default: true, description: 'Whether feature is included' })
  @IsOptional()
  @IsBoolean()
  isIncluded?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

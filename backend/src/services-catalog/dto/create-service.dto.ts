import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ServiceTypeEnum } from '@prisma/client';

export class CreateServiceDto {
  @ApiProperty({ example: 'Search Engine Optimization (SEO)', description: 'Name of the service' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Boost organic traffic and rank on page 1 of Google.', description: 'Short summary' })
  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @ApiPropertyOptional({ example: 'Full detailed breakdown of SEO methodology...', description: 'Full description' })
  @IsOptional()
  @IsString()
  fullDescription?: string;

  @ApiPropertyOptional({ example: '/uploads/seo-icon.svg', description: 'Icon URL' })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiPropertyOptional({ enum: ServiceTypeEnum, default: ServiceTypeEnum.RETAINER })
  @IsOptional()
  @IsEnum(ServiceTypeEnum)
  type?: ServiceTypeEnum;

  @ApiPropertyOptional({ example: 1500, description: 'Base starting price in USD' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'ServiceCategory UUID' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string | null;
}

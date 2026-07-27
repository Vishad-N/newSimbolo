import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePackageFeatureDto {
  @ApiProperty({ example: 'Dedicated Account Manager', description: 'Feature name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: '24/7 Slack and WhatsApp support channel', description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Package UUID' })
  @IsUUID('4')
  packageId!: string;

  @ApiPropertyOptional({ example: true, default: true, description: 'Whether included in tier' })
  @IsOptional()
  @IsBoolean()
  isIncluded?: boolean;

  @ApiPropertyOptional({ example: '5 Campaigns / month', description: 'Quantitative limit string' })
  @IsOptional()
  @IsString()
  limitValue?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

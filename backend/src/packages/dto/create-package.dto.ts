import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { PackageTypeEnum } from '@prisma/client';

export class CreatePackageDto {
  @ApiProperty({ example: 'Growth Pro', description: 'Name of the pricing package' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Ideal for scaling businesses needing daily marketing management.', description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: PackageTypeEnum, default: PackageTypeEnum.STARTER })
  @IsOptional()
  @IsEnum(PackageTypeEnum)
  type?: PackageTypeEnum;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID this package belongs to' })
  @IsUUID('4')
  serviceId!: string;

  @ApiPropertyOptional({ example: 2500, description: 'Base starting price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({ example: 'monthly', default: 'monthly', description: 'Billing interval (monthly, yearly, one-time)' })
  @IsOptional()
  @IsString()
  billingInterval?: string;

  @ApiPropertyOptional({ example: true, default: false, description: 'Whether to highlight as Most Popular' })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @ApiPropertyOptional({ example: false, default: false, description: 'Whether this is a custom quote tier' })
  @IsOptional()
  @IsBoolean()
  isCustom?: boolean;
}

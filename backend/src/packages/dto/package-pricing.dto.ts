import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class PackagePricingDto {
  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Package UUID' })
  @IsUUID('4')
  packageId!: string;

  @ApiPropertyOptional({ example: 'USD', default: 'INR', description: 'Currency code' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 1999, description: 'Price in specified currency' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: 'monthly', default: 'monthly', description: 'Billing period (monthly, yearly)' })
  @IsOptional()
  @IsString()
  billingPeriod?: string;

  @ApiPropertyOptional({ example: 15, default: 0.0, description: 'Promotional discount percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;
}

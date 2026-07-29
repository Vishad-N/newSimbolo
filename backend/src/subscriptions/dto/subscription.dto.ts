import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { SubscriptionIntervalEnum, SubscriptionStatusEnum } from '@prisma/client';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Client profile ID', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Package ID being subscribed to', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiPropertyOptional({ enum: SubscriptionIntervalEnum, default: 'MONTHLY' })
  @IsOptional()
  @IsEnum(SubscriptionIntervalEnum)
  interval?: SubscriptionIntervalEnum;

  @ApiProperty({ description: 'Subscription price per interval', example: 15000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Trial period start date' })
  @IsOptional()
  @IsDateString()
  currentPeriodStart?: string;

  @ApiPropertyOptional({ description: 'Razorpay subscription ID if applicable' })
  @IsOptional()
  @IsString()
  razorpaySubscriptionId?: string;
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ enum: SubscriptionStatusEnum })
  @IsOptional()
  @IsEnum(SubscriptionStatusEnum)
  status?: SubscriptionStatusEnum;

  @ApiPropertyOptional({ description: 'New package ID for upgrade/downgrade' })
  @IsOptional()
  @IsString()
  packageId?: string;

  @ApiPropertyOptional({ description: 'New price after upgrade/downgrade' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ description: 'Set to cancel at end of current period' })
  @IsOptional()
  @IsBoolean()
  cancelAtPeriodEnd?: boolean;
}

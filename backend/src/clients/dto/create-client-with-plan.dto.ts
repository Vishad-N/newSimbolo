import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import { SubscriptionIntervalEnum } from '@prisma/client';

export class CreateClientWithPlanDto {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @ApiProperty({ example: 'StrongPass@123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and numeric characters',
  })
  password!: string;

  @ApiProperty({ example: 'Client' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  firstName!: string;

  @ApiProperty({ example: 'Name' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  lastName!: string;

  @ApiPropertyOptional({ example: '+919999999999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Company UUID' })
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  @ApiPropertyOptional({ description: 'Account manager user UUID' })
  @IsOptional()
  @IsUUID('4')
  accountManagerId?: string;

  @ApiPropertyOptional({ example: '29ABCDE1234F1Z5' })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({ example: '123 MG Road, Mumbai, Maharashtra 400001' })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiPropertyOptional({ example: 'Asia/Kolkata', default: 'Asia/Kolkata' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'Created manually by admin.' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Package UUID to assign immediately' })
  @IsOptional()
  @IsUUID('4')
  packageId?: string;

  @ApiPropertyOptional({ enum: SubscriptionIntervalEnum, default: 'MONTHLY' })
  @IsOptional()
  @IsEnum(SubscriptionIntervalEnum)
  interval?: SubscriptionIntervalEnum;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Subscription period start date' })
  @IsOptional()
  @IsDateString()
  currentPeriodStart?: string;
}

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
  ValidateIf,
} from 'class-validator';
import { SubscriptionIntervalEnum } from '@prisma/client';
import {
  COUNTRY_CODE_MESSAGE,
  COUNTRY_CODE_PATTERN,
  LOCAL_PHONE_MESSAGE,
  LOCAL_PHONE_PATTERN,
} from '../../common/constants/phone.constant';
import { GST_NUMBER_MESSAGE, GST_NUMBER_PATTERN } from '../../common/constants/gst.constant';
import { PERSON_NAME_MESSAGE, PERSON_NAME_PATTERN } from '../../common/constants/name.constant';

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
  @Matches(PERSON_NAME_PATTERN, { message: `First ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  @Transform(({ value }) => value?.trim())
  firstName!: string;

  @ApiProperty({ example: 'Name' })
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `Last ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  @Transform(({ value }) => value?.trim())
  lastName!: string;

  @ApiPropertyOptional({ example: '+91', description: 'International dialing code' })
  @ValidateIf((dto: CreateClientWithPlanDto) => dto.phone !== undefined || dto.countryCode !== undefined)
  @IsString()
  @IsNotEmpty()
  @Matches(COUNTRY_CODE_PATTERN, { message: COUNTRY_CODE_MESSAGE })
  countryCode?: string;

  @ApiPropertyOptional({ example: '9999999999', description: '10-digit phone number, without country code' })
  @ValidateIf((dto: CreateClientWithPlanDto) => dto.phone !== undefined || dto.countryCode !== undefined)
  @IsString()
  @IsNotEmpty()
  @Matches(LOCAL_PHONE_PATTERN, { message: LOCAL_PHONE_MESSAGE })
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
  @Transform(({ value }) => value?.trim().toUpperCase())
  @Matches(GST_NUMBER_PATTERN, { message: GST_NUMBER_MESSAGE })
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

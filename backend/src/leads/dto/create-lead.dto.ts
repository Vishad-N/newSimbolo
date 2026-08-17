import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { LeadStatusEnum } from '@prisma/client';
import {
  COUNTRY_CODE_MESSAGE,
  COUNTRY_CODE_PATTERN,
  LOCAL_PHONE_MESSAGE,
  LOCAL_PHONE_PATTERN,
} from '../../common/constants/phone.constant';
import { PERSON_NAME_MESSAGE, PERSON_NAME_PATTERN } from '../../common/constants/name.constant';

export class CreateLeadDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `First ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `Last ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  lastName!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '+91', description: 'International dialing code' })
  @IsString()
  @IsNotEmpty()
  @Matches(COUNTRY_CODE_PATTERN, { message: COUNTRY_CODE_MESSAGE })
  countryCode!: string;

  @ApiProperty({ example: '9876543210', description: 'Exactly 10 digits, without country code' })
  @IsString()
  @IsNotEmpty()
  @Matches(LOCAL_PHONE_PATTERN, { message: LOCAL_PHONE_MESSAGE })
  phone!: string;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'Meta Ads' })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiProperty({ example: 'I am interested in scaling my business.' })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiPropertyOptional({ enum: LeadStatusEnum, default: LeadStatusEnum.NEW })
  @IsOptional()
  @IsEnum(LeadStatusEnum)
  status?: LeadStatusEnum;
}

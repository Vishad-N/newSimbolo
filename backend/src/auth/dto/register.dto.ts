import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  COUNTRY_CODE_MESSAGE,
  COUNTRY_CODE_PATTERN,
  LOCAL_PHONE_MESSAGE,
  LOCAL_PHONE_PATTERN,
} from '../../common/constants/phone.constant';
import { PERSON_NAME_MESSAGE, PERSON_NAME_PATTERN } from '../../common/constants/name.constant';

export class RegisterDto {
  @ApiProperty({ example: 'vishad@simbolo.ai', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @ApiProperty({
    example: 'StrongPass@123',
    description: 'Password (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and numeric characters',
  })
  password!: string;

  @ApiProperty({ example: 'Vishad', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `First ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  @Transform(({ value }) => value?.trim())
  firstName!: string;

  @ApiProperty({ example: 'Nayar', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `Last ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  @Transform(({ value }) => value?.trim())
  lastName!: string;

  @ApiPropertyOptional({ example: '+91', description: 'International dialing code' })
  @ValidateIf((dto: RegisterDto) => dto.phone !== undefined || dto.countryCode !== undefined)
  @IsString()
  @IsNotEmpty()
  @Matches(COUNTRY_CODE_PATTERN, { message: COUNTRY_CODE_MESSAGE })
  countryCode?: string;

  @ApiPropertyOptional({ example: '9876543210', description: 'Optional 10-digit phone number, without country code' })
  @ValidateIf((dto: RegisterDto) => dto.phone !== undefined || dto.countryCode !== undefined)
  @IsString()
  @IsNotEmpty()
  @Matches(LOCAL_PHONE_PATTERN, { message: LOCAL_PHONE_MESSAGE })
  phone?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsUrl, Matches } from 'class-validator';
import { UserStatusEnum } from '@prisma/client';
import {
  COUNTRY_CODE_MESSAGE,
  COUNTRY_CODE_PATTERN,
  LOCAL_PHONE_MESSAGE,
  LOCAL_PHONE_PATTERN,
} from '../../common/constants/phone.constant';
import { PERSON_NAME_MESSAGE, PERSON_NAME_PATTERN } from '../../common/constants/name.constant';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `First ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(PERSON_NAME_PATTERN, { message: `Last ${PERSON_NAME_MESSAGE.toLowerCase()}` })
  lastName?: string;

  @ApiPropertyOptional({ example: '+91', description: 'International dialing code' })
  @IsOptional()
  @IsString()
  @Matches(COUNTRY_CODE_PATTERN, { message: COUNTRY_CODE_MESSAGE })
  countryCode?: string;

  @ApiPropertyOptional({ example: '9876543210', description: '10-digit phone number, without country code' })
  @IsOptional()
  @IsString()
  @Matches(LOCAL_PHONE_PATTERN, { message: LOCAL_PHONE_MESSAGE })
  phone?: string;

  @ApiPropertyOptional({ example: 'https://avatar.url/image.jpg', description: 'Avatar image URL' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ enum: UserStatusEnum, description: 'User status' })
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;

  @ApiPropertyOptional({ example: 'uuid-role-id', description: 'Assigned Role UUID' })
  @IsOptional()
  @IsUUID('4')
  roleId?: string;

  @ApiPropertyOptional({ example: 'uuid-org-id', description: 'Assigned Organization UUID' })
  @IsOptional()
  @IsUUID('4')
  organizationId?: string;
}

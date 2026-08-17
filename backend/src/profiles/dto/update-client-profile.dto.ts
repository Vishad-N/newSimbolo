import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  GST_NUMBER_MESSAGE,
  GST_NUMBER_PATTERN,
  INDIAN_STATE_CODE_MESSAGE,
  INDIAN_STATE_CODE_PATTERN,
} from '../../common/constants/gst.constant';

export class UpdateClientProfileDto {
  @ApiPropertyOptional({ example: '29ABCDE1234F1Z5', description: 'GST identification number' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().toUpperCase())
  @Matches(GST_NUMBER_PATTERN, { message: GST_NUMBER_MESSAGE })
  gstNumber?: string;

  @ApiPropertyOptional({ example: '123 Tech Park, Bangalore, India', description: 'Billing address' })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiPropertyOptional({ example: '29', description: 'Two-digit GST state code' })
  @IsOptional()
  @IsString()
  @Matches(INDIAN_STATE_CODE_PATTERN, { message: INDIAN_STATE_CODE_MESSAGE })
  stateCode?: string;

  @ApiPropertyOptional({ example: 'Asia/Kolkata', description: 'User preferred timezone' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'uuid-company-id', description: 'Associated company UUID' })
  @IsOptional()
  @IsUUID('4')
  companyId?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateClientProfileDto {
  @ApiPropertyOptional({ example: '29ABCDE1234F1Z5', description: 'GST identification number' })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({ example: '123 Tech Park, Bangalore, India', description: 'Billing address' })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiPropertyOptional({ example: 'Asia/Kolkata', description: 'User preferred timezone' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'uuid-company-id', description: 'Associated company UUID' })
  @IsOptional()
  @IsUUID('4')
  companyId?: string;
}

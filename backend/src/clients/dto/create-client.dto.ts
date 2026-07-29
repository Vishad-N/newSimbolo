import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'c0a80123-4567-89ab-cdef-0123456789ab',
    description: 'User UUID to create client profile for',
  })
  @IsUUID('4')
  @IsNotEmpty()
  userId!: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Company UUID' })
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Account Manager User UUID' })
  @IsOptional()
  @IsUUID('4')
  accountManagerId?: string;

  @ApiPropertyOptional({ example: '29ABCDE1234F1Z5', description: 'GST registration number' })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({ example: '123 MG Road, Mumbai, Maharashtra 400001', description: 'Billing address' })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiPropertyOptional({ example: 'Asia/Kolkata', default: 'Asia/Kolkata', description: 'Timezone' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    example: 'Referred by existing client. Interested in SEO + Social Media.',
    description: 'Internal notes about the client',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

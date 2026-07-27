import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateServiceFaqDto {
  @ApiProperty({ example: 'How long does it take to see SEO results?', description: 'Question text' })
  @IsString()
  @IsNotEmpty()
  question!: string;

  @ApiProperty({ example: 'Typically 3 to 6 months depending on competition.', description: 'Answer text' })
  @IsString()
  @IsNotEmpty()
  answer!: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Parent Service UUID' })
  @IsUUID('4')
  serviceId!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

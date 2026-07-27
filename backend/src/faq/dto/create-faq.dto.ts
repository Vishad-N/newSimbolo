import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { FAQStatusEnum } from '@prisma/client';

export class CreateFaqDto {
  @ApiProperty({ example: 'What is your onboarding process?', description: 'FAQ Question' })
  @IsString()
  @IsNotEmpty()
  question!: string;

  @ApiProperty({ example: 'Once you sign the retainer agreement, we schedule a kickoff call within 24 hours...', description: 'FAQ Answer' })
  @IsString()
  @IsNotEmpty()
  answer!: string;

  @ApiPropertyOptional({ enum: FAQStatusEnum, default: FAQStatusEnum.PUBLISHED })
  @IsOptional()
  @IsEnum(FAQStatusEnum)
  status?: FAQStatusEnum;

  @ApiPropertyOptional({ example: false, default: false, description: 'Highlight in general help accordion' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'Sort ordering index' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'FAQCategory UUID' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string | null;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID' })
  @IsOptional()
  @IsUUID('4')
  serviceId?: string | null;
}

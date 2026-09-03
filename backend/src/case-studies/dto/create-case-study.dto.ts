import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CaseStudyStatusEnum } from '@prisma/client';

export class CreateCaseStudyDto {
  @ApiProperty({ example: 'Scaling FinTech Organic Traffic by 400%', description: 'Case study title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'How we helped Acme FinTech dominate high-intent keywords...',
    description: 'Executive summary',
  })
  @IsString()
  @IsNotEmpty()
  summary!: string;

  @ApiProperty({ example: 'Acme was struggling with low search visibility...', description: 'The challenge' })
  @IsString()
  @IsNotEmpty()
  challenge!: string;

  @ApiProperty({
    example: 'We deployed a full technical SEO audit and topic cluster strategy...',
    description: 'The solution implemented',
  })
  @IsString()
  @IsNotEmpty()
  solution!: string;

  @ApiProperty({
    example: 'Within 6 months, organic traffic grew by 400%...',
    description: 'The measurable results achieved',
  })
  @IsString()
  @IsNotEmpty()
  results!: string;

  @ApiProperty({ example: 'Acme FinTech Corp', description: 'Client company name' })
  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @ApiPropertyOptional({ example: 'FinTech', description: 'Industry domain' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ enum: CaseStudyStatusEnum, default: CaseStudyStatusEnum.DRAFT })
  @IsOptional()
  @IsEnum(CaseStudyStatusEnum)
  status?: CaseStudyStatusEnum;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID' })
  @IsOptional()
  @IsUUID('4')
  serviceId?: string | null;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'CaseStudyCategory UUID' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string | null;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Cover image MediaAsset UUID' })
  @IsOptional()
  @IsUUID('4')
  coverImageId?: string | null;

  @ApiPropertyOptional({ example: '5 min read', description: 'Estimated reading time shown on the case study card and detail page' })
  @IsOptional()
  @IsString()
  readTime?: string;
}

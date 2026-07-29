import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum AiCapability {
  BLOG_DRAFT = 'BLOG_DRAFT',
  IMPROVE_CONTENT = 'IMPROVE_CONTENT',
  SEO_RECOMMENDATIONS = 'SEO_RECOMMENDATIONS',
  META_TITLE = 'META_TITLE',
  META_DESCRIPTION = 'META_DESCRIPTION',
  FAQ_GENERATION = 'FAQ_GENERATION',
  SERVICE_DESCRIPTION = 'SERVICE_DESCRIPTION',
  MARKETING_COPY = 'MARKETING_COPY',
  LANDING_PAGE_COPY = 'LANDING_PAGE_COPY',
  EMAIL_DRAFT = 'EMAIL_DRAFT',
}

export class AiGenerationDto {
  @ApiProperty({ enum: AiCapability })
  @IsEnum(AiCapability)
  capability: AiCapability;

  @ApiProperty({ minLength: 3, maxLength: 4000 })
  @IsString()
  @MinLength(3)
  @MaxLength(4000)
  prompt: string;

  @ApiPropertyOptional({ maxLength: 12000 })
  @IsOptional()
  @IsString()
  @MaxLength(12000)
  content?: string;

  @ApiPropertyOptional({ example: 'professional' })
  @IsOptional()
  @IsString()
  tone?: string;
}

export interface AiGenerationResult {
  provider: string;
  capability: AiCapability;
  output: string;
  suggestions: string[];
  generatedAt: string;
}

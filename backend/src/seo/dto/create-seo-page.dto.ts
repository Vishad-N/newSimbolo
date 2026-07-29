import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSeoPageDto {
  @ApiProperty({ example: '/services/seo', description: 'URL path mapping' })
  @IsString()
  @IsNotEmpty()
  path!: string;

  @ApiProperty({ example: 'Search Engine Optimization Services | The Simbolo', description: 'Page title tag' })
  @IsString()
  @IsNotEmpty()
  metaTitle!: string;

  @ApiProperty({
    example: 'Boost organic traffic and achieve page 1 Google rankings with our AI-powered SEO solutions.',
    description: 'Meta description tag',
  })
  @IsString()
  @IsNotEmpty()
  metaDescription!: string;

  @ApiPropertyOptional({ example: 'seo, search engine optimization, digital marketing', description: 'Meta keywords' })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional({ example: 'https://thesimbolo.com/services/seo', description: 'Canonical URL' })
  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @ApiPropertyOptional({ example: 'Search Engine Optimization | The Simbolo', description: 'OpenGraph title' })
  @IsOptional()
  @IsString()
  ogTitle?: string;

  @ApiPropertyOptional({
    example: 'Boost organic traffic with our AI SEO solutions.',
    description: 'OpenGraph description',
  })
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional({
    example: 'c0a80123-4567-89ab-cdef-0123456789ab',
    description: 'OpenGraph Image MediaAsset UUID',
  })
  @IsOptional()
  @IsUUID('4')
  ogImageId?: string | null;

  @ApiPropertyOptional({ example: 'summary_large_image', default: 'summary_large_image' })
  @IsOptional()
  @IsString()
  twitterCard?: string;

  @ApiPropertyOptional({
    example: '{"@context": "https://schema.org", "@type": "Service"}',
    description: 'Structured JSON-LD schema string',
  })
  @IsOptional()
  @IsString()
  schemaJson?: string;

  @ApiPropertyOptional({ example: true, default: true, description: 'Whether robots should index this page' })
  @IsOptional()
  @IsBoolean()
  indexable?: boolean;

  @ApiPropertyOptional({ example: true, default: true, description: 'Whether robots should follow links on this page' })
  @IsOptional()
  @IsBoolean()
  followable?: boolean;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSitemapEntryDto {
  @ApiProperty({ example: '/services/seo', description: 'URL path loc' })
  @IsString()
  @IsNotEmpty()
  loc!: string;

  @ApiPropertyOptional({ example: 'weekly', default: 'weekly', description: 'Change frequency (always, hourly, daily, weekly, monthly, yearly, never)' })
  @IsOptional()
  @IsString()
  changefreq?: string;

  @ApiPropertyOptional({ example: 0.8, default: 0.8, description: 'Crawl priority from 0.0 to 1.0' })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ example: true, default: true, description: 'Whether active in XML sitemap generation' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

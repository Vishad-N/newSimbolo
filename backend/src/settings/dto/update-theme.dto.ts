import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateThemeDto {
  @ApiPropertyOptional({ example: '#14B8A6', description: 'Primary brand hex color' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'primaryColor must be a valid 6-character hex color code' })
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#0F172A', description: 'Secondary brand hex color' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'secondaryColor must be a valid 6-character hex color code' })
  secondaryColor?: string;

  @ApiPropertyOptional({ example: '#F59E0B', description: 'Accent hex color' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'accentColor must be a valid 6-character hex color code' })
  accentColor?: string;

  @ApiPropertyOptional({ example: '/uploads/dark-logo.png', description: 'URL to dark mode logo image' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  darkModeLogoUrl?: string | null;

  @ApiPropertyOptional({ example: '/uploads/light-logo.png', description: 'URL to light mode logo image' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  lightModeLogoUrl?: string | null;

  @ApiPropertyOptional({ example: 'Inter', description: 'Primary font family name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fontFamily?: string;
}

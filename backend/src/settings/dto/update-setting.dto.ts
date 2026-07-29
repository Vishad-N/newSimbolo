import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: 'site_maintenance_mode', description: 'Unique key identifying the setting' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key!: string;

  @ApiProperty({ example: 'false', description: 'Value stored as string or JSON string' })
  @IsString()
  @IsNotEmpty()
  value!: string;

  @ApiPropertyOptional({ example: 'Toggles site-wide maintenance banner', description: 'Helpful description' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether this setting is publicly accessible without authentication',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: 'GENERAL', description: 'Category grouping name' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}

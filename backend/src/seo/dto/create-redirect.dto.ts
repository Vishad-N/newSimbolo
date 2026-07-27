import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRedirectDto {
  @ApiProperty({ example: '/old-pricing-page', description: 'Legacy source path' })
  @IsString()
  @IsNotEmpty()
  sourcePath!: string;

  @ApiProperty({ example: '/pricing', description: 'Target destination path' })
  @IsString()
  @IsNotEmpty()
  targetPath!: string;

  @ApiPropertyOptional({ example: 301, default: 301, description: 'HTTP redirect status code (301 or 302)' })
  @IsOptional()
  @IsInt()
  statusCode?: number;

  @ApiPropertyOptional({ example: true, default: true, description: 'Whether the rule is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

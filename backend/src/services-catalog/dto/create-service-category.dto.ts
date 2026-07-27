import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceCategoryDto {
  @ApiProperty({ example: 'Growth Marketing', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'High-impact campaigns for scaling startups', description: 'Category description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'Sort ordering index' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

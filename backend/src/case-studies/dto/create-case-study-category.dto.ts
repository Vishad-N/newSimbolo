import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCaseStudyCategoryDto {
  @ApiProperty({ example: 'SaaS & Technology', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Success stories for cloud software startups', description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;
}

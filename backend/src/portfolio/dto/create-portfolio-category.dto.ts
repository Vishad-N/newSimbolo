import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePortfolioCategoryDto {
  @ApiProperty({ example: 'Video Reels & Animation', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Motion design, video editing, and 3D animations', description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;
}

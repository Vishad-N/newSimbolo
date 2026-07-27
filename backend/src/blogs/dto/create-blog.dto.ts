import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BlogStatusEnum } from '@prisma/client';

export class CreateBlogDto {
  @ApiProperty({ example: '10 AI Marketing Trends in 2026', description: 'Article title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Discover how artificial intelligence is transforming digital advertising...', description: 'Short summary excerpt' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: '# AI Marketing in 2026\n\nFull markdown or html article body...', description: 'Full article body content' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ enum: BlogStatusEnum, default: BlogStatusEnum.DRAFT })
  @IsOptional()
  @IsEnum(BlogStatusEnum)
  status?: BlogStatusEnum;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Author UUID' })
  @IsUUID('4')
  authorId!: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Cover image MediaAsset UUID' })
  @IsOptional()
  @IsUUID('4')
  coverImageId?: string | null;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'BlogCategory UUID' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string | null;

  @ApiPropertyOptional({ example: ['AI', 'Marketing', 'SEO'], description: 'Array of tag names to attach or create' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

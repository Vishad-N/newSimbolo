import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { VideoCatalogComplexityEnum, VideoCatalogStatusEnum, VideoPreviewTypeEnum } from '@prisma/client';

export class CreateVideoCatalogItemDto {
  @ApiProperty({ example: 'Instagram Reels & TikToks' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: ['cat-1', 'cat-2'], description: 'Category IDs this card should appear under' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @ApiProperty({ example: 'https://res.cloudinary.com/.../thumbnail.jpg' })
  @IsString()
  @IsNotEmpty()
  thumbnail!: string;

  @ApiPropertyOptional({ enum: VideoPreviewTypeEnum, default: VideoPreviewTypeEnum.YOUTUBE })
  @IsOptional()
  @IsEnum(VideoPreviewTypeEnum)
  previewType?: VideoPreviewTypeEnum;

  @ApiProperty({ example: 'https://www.youtube.com/embed/xxxxxxxxxxx', description: 'Video link shown in the player' })
  @IsString()
  @IsNotEmpty()
  previewUrl!: string;

  @ApiProperty({ example: 'High-retention short-form content with captions, sound effects, and fast-paced cuts.' })
  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullDescription?: string;

  @ApiPropertyOptional({ example: 600, description: 'Hourly rate shown on the card' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({ example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: '24-48 Hours' })
  @IsOptional()
  @IsString()
  estimatedDelivery?: string;

  @ApiPropertyOptional({ example: '15-60 Seconds' })
  @IsOptional()
  @IsString()
  recommendedDuration?: string;

  @ApiPropertyOptional({ enum: VideoCatalogComplexityEnum, default: VideoCatalogComplexityEnum.MEDIUM })
  @IsOptional()
  @IsEnum(VideoCatalogComplexityEnum)
  complexity?: VideoCatalogComplexityEnum;

  @ApiPropertyOptional({ example: ['Trending', 'Fast Delivery'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'Popular' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ enum: VideoCatalogStatusEnum, default: VideoCatalogStatusEnum.PUBLISHED })
  @IsOptional()
  @IsEnum(VideoCatalogStatusEnum)
  status?: VideoCatalogStatusEnum;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ example: 'Request Quote' })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional({ example: '/contact?service=video-reels' })
  @IsOptional()
  @IsString()
  ctaLink?: string;
}

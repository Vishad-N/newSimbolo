import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { MediaTypeEnum } from '@prisma/client';

export class MediaFilterDto {
  @ApiPropertyOptional({ enum: MediaTypeEnum, description: 'Filter by media type (IMAGE, VIDEO, PDF, etc.)' })
  @IsOptional()
  @IsEnum(MediaTypeEnum)
  mediaType?: MediaTypeEnum;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Filter by folder UUID or "root"' })
  @IsOptional()
  @IsString()
  folderId?: string;

  @ApiPropertyOptional({ example: 'logo', description: 'Search term for file name' })
  @IsOptional()
  @IsString()
  search?: string;
}

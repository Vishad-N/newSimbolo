import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMediaFolderDto {
  @ApiProperty({ example: 'Blog Covers', description: 'Name of the media folder' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Parent folder UUID if nested' })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;
}

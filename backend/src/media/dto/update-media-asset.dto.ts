import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateMediaAssetDto {
  @ApiPropertyOptional({ example: 'new-cover-image.png', description: 'Updated file name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fileName?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Destination folder UUID' })
  @IsOptional()
  @IsUUID('4')
  folderId?: string | null;
}

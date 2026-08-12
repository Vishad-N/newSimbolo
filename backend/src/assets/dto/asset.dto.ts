import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetFolderDto {
  @ApiProperty({ example: 'Brand Assets' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'Parent folder UUID' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}

export class UploadRequestDto {
  @ApiProperty({ example: 'logo.png' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  mimeType: string;

  @ApiProperty({ example: 102400 })
  @IsNumber()
  sizeBytes: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}

export class RenameAssetDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class MoveAssetDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  folderId?: string | null;
}

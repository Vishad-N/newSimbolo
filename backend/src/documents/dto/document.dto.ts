import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { DocumentCategoryEnum } from '@prisma/client';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Client NDA – Acme Corp 2026', description: 'Document title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ description: 'Document description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: DocumentCategoryEnum,
    default: DocumentCategoryEnum.OTHER,
    description: 'Document category',
  })
  @IsOptional()
  @IsEnum(DocumentCategoryEnum)
  category?: DocumentCategoryEnum;

  @ApiProperty({ example: 'https://cdn.simbolo.in/documents/nda-acme-2026.pdf', description: 'Document file URL' })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @ApiPropertyOptional({ example: 204800, description: 'File size in bytes' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fileSize?: number;

  @ApiPropertyOptional({ example: 'application/pdf', description: 'MIME type' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Client profile UUID' })
  @IsOptional()
  @IsUUID('4')
  clientId?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' })
  @IsOptional()
  @IsUUID('4')
  projectId?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Company UUID' })
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether the document is publicly accessible' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UploadDocumentDto {
  @ApiProperty({ example: 'Client NDA – Acme Corp 2026', description: 'Document title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ description: 'Document description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: DocumentCategoryEnum,
    default: DocumentCategoryEnum.OTHER,
    description: 'Document category',
  })
  @IsOptional()
  @IsEnum(DocumentCategoryEnum)
  category?: DocumentCategoryEnum;

  @ApiPropertyOptional({
    description: 'Client profile UUID to attach the document to. Staff-only — a client caller always uploads to their own profile regardless of this field.',
  })
  @IsOptional()
  @IsUUID('4')
  clientId?: string;

  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsUUID('4')
  projectId?: string;
}

export class UpdateDocumentDto {
  @ApiPropertyOptional({ description: 'Document title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Document description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: DocumentCategoryEnum, description: 'Document category' })
  @IsOptional()
  @IsEnum(DocumentCategoryEnum)
  category?: DocumentCategoryEnum;

  @ApiPropertyOptional({ example: false, description: 'Whether the document is publicly accessible' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

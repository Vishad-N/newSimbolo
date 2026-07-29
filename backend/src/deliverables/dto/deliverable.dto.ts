import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DeliverableStatusEnum } from '@prisma/client';

export class CreateDeliverableDto {
  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' })
  @IsUUID('4')
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({ example: 'Homepage Design – Final Version', description: 'Deliverable title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'Final homepage design based on approved wireframes',
    description: 'Deliverable description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'c0a80123-4567-89ab-cdef-0123456789ab',
    description: 'Media asset UUID for the uploaded file',
  })
  @IsOptional()
  @IsUUID('4')
  mediaAssetId?: string;
}

export class UpdateDeliverableDto {
  @ApiPropertyOptional({ description: 'Deliverable title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Deliverable description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: DeliverableStatusEnum, description: 'Deliverable status' })
  @IsOptional()
  @IsEnum(DeliverableStatusEnum)
  status?: DeliverableStatusEnum;

  @ApiPropertyOptional({
    example: 'Please adjust the color palette to match the updated brand guide.',
    description: 'Revision notes from client',
  })
  @IsOptional()
  @IsString()
  revisionNotes?: string;

  @ApiPropertyOptional({ description: 'Client feedback message' })
  @IsOptional()
  @IsString()
  clientFeedback?: string;

  @ApiPropertyOptional({
    example: 'c0a80123-4567-89ab-cdef-0123456789ab',
    description: 'New media asset UUID (for version upload)',
  })
  @IsOptional()
  @IsUUID('4')
  mediaAssetId?: string;
}

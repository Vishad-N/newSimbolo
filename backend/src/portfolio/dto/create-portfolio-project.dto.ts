import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { PortfolioStatusEnum } from '@prisma/client';

export class CreatePortfolioProjectDto {
  @ApiProperty({ example: 'FinTech App UI/UX Redesign & Animation Reel', description: 'Project title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Complete overhaul of mobile dashboard animations...', description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Acme Bank Ltd', description: 'Client name' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({ example: 'https://acmebank.example.com', description: 'Live preview URL' })
  @IsOptional()
  @IsString()
  liveUrl?: string;

  @ApiPropertyOptional({ example: '2026-06-15T00:00:00.000Z', description: 'Completion date ISO string' })
  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @ApiPropertyOptional({ enum: PortfolioStatusEnum, default: PortfolioStatusEnum.PUBLISHED })
  @IsOptional()
  @IsEnum(PortfolioStatusEnum)
  status?: PortfolioStatusEnum;

  @ApiPropertyOptional({ example: true, default: false, description: 'Highlight in featured gallery showcase' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID' })
  @IsOptional()
  @IsUUID('4')
  serviceId?: string | null;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'PortfolioCategory UUID' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string | null;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Cover image MediaAsset UUID' })
  @IsOptional()
  @IsUUID('4')
  coverImageId?: string | null;
}

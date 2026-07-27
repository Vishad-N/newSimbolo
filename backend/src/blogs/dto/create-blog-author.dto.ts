import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateBlogAuthorDto {
  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'User account UUID to link as author' })
  @IsUUID('4')
  userId!: string;

  @ApiPropertyOptional({ example: 'Head of Growth at The Simbolo.', description: 'Author biography' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: '/uploads/avatar.png', description: 'Avatar image URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/simbolo', description: 'Twitter profile URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  twitterUrl?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/simbolo', description: 'LinkedIn profile URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  linkedinUrl?: string;
}

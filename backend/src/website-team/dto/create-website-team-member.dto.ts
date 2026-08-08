import { IsString, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWebsiteTeamMemberDto {
  @ApiProperty({ description: 'The name of the team member' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The designation or role of the team member' })
  @IsString()
  designation: string;

  @ApiPropertyOptional({ description: 'A short bio of the team member' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'URL to the profile image' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: 'Display order for sorting', default: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Social links (e.g. linkedin, email)' })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Whether the member is actively displayed', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

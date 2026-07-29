import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AssignTeamMemberDto {
  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Project UUID' })
  @IsUUID('4')
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'User UUID to assign' })
  @IsUUID('4')
  @IsNotEmpty()
  userId!: string;

  @ApiPropertyOptional({
    example: 'DESIGNER',
    description:
      'Role on the project (PROJECT_MANAGER, DESIGNER, DEVELOPER, VIDEO_EDITOR, SEO_SPECIALIST, MARKETING_SPECIALIST, MEMBER)',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    example: 'Responsible for all visual assets and brand guidelines',
    description: 'Description of responsibilities',
  })
  @IsOptional()
  @IsString()
  responsibilities?: string;
}

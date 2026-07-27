import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Marketing Intern', description: 'Human readable role name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'MARKETING_INTERN', description: 'Unique slug identifier' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiPropertyOptional({ example: 'Can view marketing reports and draft blog posts', description: 'Role description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['uuid-1', 'uuid-2'], description: 'Array of Permission UUIDs to assign' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}

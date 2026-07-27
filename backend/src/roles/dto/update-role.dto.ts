import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Senior Marketing Intern', description: 'Updated role name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Can view marketing reports, draft and edit blog posts',
    description: 'Updated description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['uuid-1', 'uuid-2'], description: 'Updated array of Permission UUIDs' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}

export class AssignPermissionsDto {
  @ApiProperty({ example: ['uuid-1', 'uuid-2'], description: 'Array of Permission UUIDs to assign to role' })
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  permissionIds!: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldSecretPass123!', description: 'Current user password' })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({ example: 'NewSecurePass456!', description: 'New user password (minimum 8 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;
}

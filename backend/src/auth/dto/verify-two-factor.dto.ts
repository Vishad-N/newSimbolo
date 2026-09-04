import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTwoFactorDto {
  @ApiProperty({ example: 'a1b2c3...', description: 'mfaToken returned by POST /auth/login when 2FA is required' })
  @IsString()
  @IsNotEmpty()
  mfaToken!: string;

  @ApiProperty({ example: '123456', description: '6-digit TOTP code, or a single-use backup code' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}

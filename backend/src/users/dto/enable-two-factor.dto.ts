import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EnableTwoFactorDto {
  @ApiProperty({ example: '123456', description: '6-digit code from the authenticator app, proving setup succeeded' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}

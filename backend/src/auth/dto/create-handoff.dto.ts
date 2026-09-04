import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHandoffDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...', description: 'Already-issued access token to wrap' })
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...', description: 'Already-issued refresh token to wrap' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

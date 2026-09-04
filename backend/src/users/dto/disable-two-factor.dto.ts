import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DisableTwoFactorDto {
  @ApiProperty({ example: 'CurrentPass123!', description: 'Current account password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

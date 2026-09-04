import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExchangeHandoffDto {
  @ApiProperty({ example: 'a1b2c3...', description: 'One-time code returned by POST /auth/handoff' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}

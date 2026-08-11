import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ClientCheckoutDto {
  @ApiProperty({
    example: 'c0a80123-4567-89ab-cdef-0123456789ab',
    description: 'Package UUID to purchase',
  })
  @IsUUID('4')
  @IsNotEmpty()
  packageId!: string;
}

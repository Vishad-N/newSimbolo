import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({ example: 'ACTIVE', description: 'Client status (ACTIVE, INACTIVE, SUSPENDED)' })
  @IsOptional()
  @IsString()
  status?: string;
}

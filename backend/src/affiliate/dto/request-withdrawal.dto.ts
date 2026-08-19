import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, MaxLength } from 'class-validator';

export class RequestWithdrawalDto {
  @ApiProperty({ description: 'Amount in rupees to withdraw from the available wallet balance', example: 1500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ description: 'Payout method to use. Defaults to the affiliate default method.' })
  @IsOptional()
  @IsUUID()
  payoutMethodId?: string;
}

export class WithdrawalActionDto {
  @ApiPropertyOptional({ description: 'Reason / note recorded on the audit trail' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PayoutMethodTypeEnum } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/**
 * NOTE: full account numbers / UPI handles are never persisted. The service layer
 * derives `maskedDetails` + `last4` and hands the sensitive values straight to
 * RazorpayX for fund-account creation.
 */
export class CreatePayoutMethodDto {
  @ApiProperty({ enum: PayoutMethodTypeEnum })
  @IsEnum(PayoutMethodTypeEnum)
  type: PayoutMethodTypeEnum;

  @ApiPropertyOptional({ description: 'Bank account number (BANK_ACCOUNT only) — never stored in full' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  accountNumber?: string;

  @ApiPropertyOptional({ description: 'IFSC code (BANK_ACCOUNT only)' })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  ifsc?: string;

  @ApiPropertyOptional({ description: 'Account holder name (BANK_ACCOUNT only)' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  accountHolderName?: string;

  @ApiPropertyOptional({ description: 'UPI VPA (UPI only) — never stored in full', example: 'name@bank' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Matches(/^[\w.\-]{2,64}@[a-zA-Z]{2,64}$/, { message: 'upiId must be a valid UPI VPA' })
  upiId?: string;

  @ApiPropertyOptional({ description: 'Mark this method as the default payout destination' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdatePayoutMethodDto {
  @ApiPropertyOptional({ description: 'Mark this method as the default payout destination' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Disable this payout method' })
  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}

export class PreparePaymentEmployeeDto {
  @ApiProperty({ description: 'Employee code applied to this checkout', example: 'EMP-7K2QX' })
  @IsString()
  @IsNotEmpty()
  employeeCode: string;
}

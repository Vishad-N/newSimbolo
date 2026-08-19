import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommissionCalculationBasisEnum } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class UpdateAffiliateSettingsDto {
  @ApiPropertyOptional({ description: 'Default commission percentage applied to new affiliates', example: 15 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  defaultCommissionRate?: number;

  @ApiPropertyOptional({ enum: CommissionCalculationBasisEnum })
  @IsOptional()
  @IsEnum(CommissionCalculationBasisEnum)
  commissionCalculationBasis?: CommissionCalculationBasisEnum;

  @ApiPropertyOptional({ description: 'Days a commission stays PENDING before becoming ELIGIBLE', example: 7 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  commissionHoldPeriodDays?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minimumWithdrawalAmount?: number;

  @ApiPropertyOptional({ example: 200000 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maximumWithdrawalAmount?: number;

  @ApiPropertyOptional({ example: 'WEEKLY' })
  @IsOptional()
  @IsString()
  paydayFrequency?: string;

  @ApiPropertyOptional({ description: '0 = Sunday … 6 = Saturday', example: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  paydayDayOfWeek?: number;

  @ApiPropertyOptional({ example: '17:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'paydayCutoffTime must be HH:mm' })
  paydayCutoffTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  payoutAutoProcessingEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Allow an employee to use their own code on their own purchase' })
  @IsOptional()
  @IsBoolean()
  selfReferralAllowed?: boolean;
}

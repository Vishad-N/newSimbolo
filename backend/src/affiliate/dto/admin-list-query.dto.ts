import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  AffiliateStatusEnum,
  CommissionStatusEnum,
  WithdrawalStatusEnum,
} from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class AdminAffiliateListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: AffiliateStatusEnum })
  @IsOptional()
  @IsEnum(AffiliateStatusEnum)
  status?: AffiliateStatusEnum;

  @ApiPropertyOptional({ description: 'Free-text search over employee code / name / email' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class AdminCommissionListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: CommissionStatusEnum })
  @IsOptional()
  @IsEnum(CommissionStatusEnum)
  status?: CommissionStatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  affiliateId?: string;
}

export class AdminWithdrawalListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: WithdrawalStatusEnum })
  @IsOptional()
  @IsEnum(WithdrawalStatusEnum)
  status?: WithdrawalStatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  affiliateId?: string;
}

export class AdminSalesListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  affiliateId?: string;
}

export class CreateAffiliateEmployeeDto {
  @ApiPropertyOptional({ description: 'Existing user ID to convert into a sales employee' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: 'Commission percentage override. Defaults to program default.' })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  commissionRate?: number;
}

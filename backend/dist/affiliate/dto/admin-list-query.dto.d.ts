import { AffiliateStatusEnum, CommissionStatusEnum, WithdrawalStatusEnum } from '@prisma/client';
export declare class PaginationQueryDto {
    page?: number;
    limit?: number;
}
export declare class AdminAffiliateListQueryDto extends PaginationQueryDto {
    status?: AffiliateStatusEnum;
    search?: string;
}
export declare class AdminCommissionListQueryDto extends PaginationQueryDto {
    status?: CommissionStatusEnum;
    affiliateId?: string;
}
export declare class AdminWithdrawalListQueryDto extends PaginationQueryDto {
    status?: WithdrawalStatusEnum;
    affiliateId?: string;
}
export declare class AdminSalesListQueryDto extends PaginationQueryDto {
    affiliateId?: string;
}
export declare class CreateAffiliateEmployeeDto {
    userId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    countryCode?: string;
    phone?: string;
    commissionRate?: number;
}

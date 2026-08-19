import { CommissionCalculationBasisEnum } from '@prisma/client';
export declare class UpdateAffiliateSettingsDto {
    defaultCommissionRate?: number;
    commissionCalculationBasis?: CommissionCalculationBasisEnum;
    commissionHoldPeriodDays?: number;
    minimumWithdrawalAmount?: number;
    maximumWithdrawalAmount?: number;
    paydayFrequency?: string;
    paydayDayOfWeek?: number;
    paydayCutoffTime?: string;
    payoutAutoProcessingEnabled?: boolean;
    selfReferralAllowed?: boolean;
}

import { AdminAffiliateListQueryDto, AdminCommissionListQueryDto, AdminSalesListQueryDto, AdminWithdrawalListQueryDto, CreateAffiliateEmployeeDto } from '../dto/admin-list-query.dto';
import { WithdrawalActionDto } from '../dto/request-withdrawal.dto';
import { UpdateAffiliateSettingsDto } from '../dto/update-affiliate-settings.dto';
import { AffiliateSettingsService } from '../services/affiliate-settings.service';
import { AffiliateService } from '../services/affiliate.service';
import { CommissionSweepService } from '../services/commission-sweep.service';
import { WithdrawalService } from '../services/withdrawal.service';
export declare class AdminAffiliateController {
    private readonly affiliateService;
    private readonly withdrawalService;
    private readonly settingsService;
    private readonly sweepService;
    constructor(affiliateService: AffiliateService, withdrawalService: WithdrawalService, settingsService: AffiliateSettingsService, sweepService: CommissionSweepService);
    listEmployees(query: AdminAffiliateListQueryDto): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
            };
            wallet: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                version: number;
                affiliateId: string;
                pendingBalance: number;
                availableBalance: number;
                lifetimeEarned: number;
                lifetimeWithdrawn: number;
            } | null;
            _count: {
                commissions: number;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.AffiliateStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            commissionRate: number;
            affiliateCode: string;
            commissionBasisDefault: import(".prisma/client").$Enums.CommissionCalculationBasisEnum | null;
            totalEarnings: number;
            pendingBalance: number;
            paidBalance: number;
            isEligibleForCommission: boolean;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getEmployee(id: string): Promise<{
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            version: number;
            affiliateId: string;
            pendingBalance: number;
            availableBalance: number;
            lifetimeEarned: number;
            lifetimeWithdrawn: number;
        } | null;
        payoutMethods: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PayoutMethodStatusEnum;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.PayoutMethodTypeEnum;
            affiliateId: string;
            isDefault: boolean;
            razorpayContactId: string | null;
            razorpayFundAccountId: string | null;
            maskedDetails: string;
            last4: string | null;
            verifiedAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.AffiliateStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        commissionRate: number;
        affiliateCode: string;
        commissionBasisDefault: import(".prisma/client").$Enums.CommissionCalculationBasisEnum | null;
        totalEarnings: number;
        pendingBalance: number;
        paidBalance: number;
        isEligibleForCommission: boolean;
    }>;
    createEmployee(dto: CreateAffiliateEmployeeDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.AffiliateStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        commissionRate: number;
        affiliateCode: string;
        commissionBasisDefault: import(".prisma/client").$Enums.CommissionCalculationBasisEnum | null;
        totalEarnings: number;
        pendingBalance: number;
        paidBalance: number;
        isEligibleForCommission: boolean;
    }>;
    activate(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.AffiliateStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        commissionRate: number;
        affiliateCode: string;
        commissionBasisDefault: import(".prisma/client").$Enums.CommissionCalculationBasisEnum | null;
        totalEarnings: number;
        pendingBalance: number;
        paidBalance: number;
        isEligibleForCommission: boolean;
    }>;
    deactivate(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.AffiliateStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        commissionRate: number;
        affiliateCode: string;
        commissionBasisDefault: import(".prisma/client").$Enums.CommissionCalculationBasisEnum | null;
        totalEarnings: number;
        pendingBalance: number;
        paidBalance: number;
        isEligibleForCommission: boolean;
    }>;
    listSales(query: AdminSalesListQueryDto): Promise<{
        data: {
            order: {
                package: {
                    id: string;
                    name: string;
                } | null;
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                client: {
                    user: {
                        email: string;
                        firstName: string;
                        lastName: string;
                    };
                    id: string;
                };
                currency: string;
                orderNumber: string;
                totalAmount: number;
                taxAmount: number;
                discountAmount: number;
                netAmount: number;
            };
            affiliate: {
                id: string;
                affiliateCode: string;
            };
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CommissionStatusEnum;
            commissionRate: number;
            commissionAmount: number;
            employeeCodeSnapshot: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    listCommissions(query: AdminCommissionListQueryDto): Promise<{
        data: ({
            order: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                currency: string;
                orderNumber: string;
                netAmount: number;
            };
            affiliate: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                id: string;
                affiliateCode: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CommissionStatusEnum;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            currency: string;
            orderId: string;
            paymentId: string | null;
            affiliateId: string;
            commissionRate: number;
            commissionAmount: number;
            commissionBaseAmount: number;
            reversedAmount: number | null;
            employeeCodeSnapshot: string;
            calculationBasis: import(".prisma/client").$Enums.CommissionCalculationBasisEnum;
            eligibleAt: Date | null;
            creditedAt: Date | null;
            reversedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    listWithdrawals(query: AdminWithdrawalListQueryDto): Promise<{
        data: ({
            affiliate: {
                user: {
                    email: string;
                    id: string;
                    firstName: string;
                    lastName: string;
                };
                id: string;
                affiliateCode: string;
            };
            payoutMethod: {
                id: string;
                type: import(".prisma/client").$Enums.PayoutMethodTypeEnum;
                maskedDetails: string;
                last4: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            amount: number;
            affiliateId: string;
            razorpayContactId: string | null;
            razorpayFundAccountId: string | null;
            walletId: string;
            requestedAt: Date;
            scheduledAt: Date | null;
            processedAt: Date | null;
            razorpayPayoutId: string | null;
            payoutMethodId: string | null;
            failureReason: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getWithdrawal(id: string): Promise<{
        affiliate: {
            user: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            affiliateCode: string;
        };
        payoutMethod: {
            id: string;
            type: import(".prisma/client").$Enums.PayoutMethodTypeEnum;
            maskedDetails: string;
            last4: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: number;
        affiliateId: string;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        payoutMethodId: string | null;
        failureReason: string | null;
    }>;
    approve(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: number;
        affiliateId: string;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        payoutMethodId: string | null;
        failureReason: string | null;
    }>;
    process(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: number;
        affiliateId: string;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        payoutMethodId: string | null;
        failureReason: string | null;
    }>;
    retry(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: number;
        affiliateId: string;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        payoutMethodId: string | null;
        failureReason: string | null;
    }>;
    cancel(id: string, dto: WithdrawalActionDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: number;
        affiliateId: string;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        payoutMethodId: string | null;
        failureReason: string | null;
    }>;
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        defaultCommissionRate: number;
        commissionCalculationBasis: import(".prisma/client").$Enums.CommissionCalculationBasisEnum;
        commissionHoldPeriodDays: number;
        minimumWithdrawalAmount: number;
        maximumWithdrawalAmount: number;
        paydayFrequency: string;
        paydayDayOfWeek: number | null;
        paydayCutoffTime: string | null;
        payoutAutoProcessingEnabled: boolean;
        selfReferralAllowed: boolean;
    }>;
    updateSettings(dto: UpdateAffiliateSettingsDto, user: any): Promise<{
        id: string;
        updatedAt: Date;
        updatedBy: string | null;
        defaultCommissionRate: number;
        commissionCalculationBasis: import(".prisma/client").$Enums.CommissionCalculationBasisEnum;
        commissionHoldPeriodDays: number;
        minimumWithdrawalAmount: number;
        maximumWithdrawalAmount: number;
        paydayFrequency: string;
        paydayDayOfWeek: number | null;
        paydayCutoffTime: string | null;
        payoutAutoProcessingEnabled: boolean;
        selfReferralAllowed: boolean;
    }>;
    runSweep(): Promise<import("../services/commission-sweep.service").SweepResult>;
    overview(): Promise<{
        totalSales: {
            count: number;
            amount: number;
        };
        totalAffiliateSales: {
            count: number;
            amount: number;
        };
        activeEmployees: number;
        totalCommission: number;
        pendingCommission: number;
        availableWalletLiability: number;
        heldWalletLiability: number;
        pendingWithdrawals: {
            count: number;
            amount: number;
        };
        paidWithdrawals: {
            count: number;
            amount: number;
        };
    }>;
}

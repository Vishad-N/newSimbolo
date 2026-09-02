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
        data: {
            id: string;
            userId: string;
            name: string;
            email: string;
            affiliateCode: string;
            status: import(".prisma/client").$Enums.AffiliateStatusEnum;
            ordersCount: number;
            salesTotal: number;
            commissionTotal: number;
            walletAvailable: number;
            walletPending: number;
            lifetimeWithdrawn: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getEmployee(id: string): Promise<{
        commissions: ({
            order: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                orderNumber: string;
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
        withdrawals: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            amount: number;
            affiliateId: string;
            walletId: string;
            requestedAt: Date;
            scheduledAt: Date | null;
            processedAt: Date | null;
            razorpayPayoutId: string | null;
            razorpayContactId: string | null;
            razorpayFundAccountId: string | null;
            payoutMethodId: string | null;
            failureReason: string | null;
        }[];
        walletTransactions: never[] | {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.WalletTransactionTypeEnum;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            amount: number;
            walletId: string;
            balanceBefore: number;
            balanceAfter: number;
            referenceType: string;
            referenceId: string;
        }[];
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
            razorpayContactId: string | null;
            razorpayFundAccountId: string | null;
            isDefault: boolean;
            maskedDetails: string;
            last4: string | null;
            verifiedAt: Date | null;
        }[];
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
    deleteEmployee(id: string, user: any): Promise<{
        deleted: true;
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
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                taxAmount: import("@prisma/client/runtime/library").Decimal;
                discountAmount: import("@prisma/client/runtime/library").Decimal;
                netAmount: import("@prisma/client/runtime/library").Decimal;
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
                netAmount: import("@prisma/client/runtime/library").Decimal;
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
        data: {
            id: string;
            affiliateId: string;
            employeeName: string;
            employeeCode: string;
            amount: number;
            status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
            requestedAt: Date;
            scheduledAt: Date | null;
            processedAt: Date | null;
            payoutMethod: string | null;
            razorpayPayoutId: string | null;
            failureReason: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getWithdrawal(id: string): Promise<{
        id: string;
        affiliateId: string;
        employeeName: string;
        employeeCode: string;
        amount: number;
        status: import(".prisma/client").$Enums.WithdrawalStatusEnum;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        payoutMethod: string | null;
        razorpayPayoutId: string | null;
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
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
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
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
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
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
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
        walletId: string;
        requestedAt: Date;
        scheduledAt: Date | null;
        processedAt: Date | null;
        razorpayPayoutId: string | null;
        razorpayContactId: string | null;
        razorpayFundAccountId: string | null;
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
        totalSales: number | import("@prisma/client/runtime/library").Decimal;
        totalAffiliateSales: number;
        activeEmployees: number;
        totalCommission: number;
        pendingCommission: number;
        availableWalletLiability: number;
        heldWalletLiability: number;
        pendingWithdrawals: number;
        paidWithdrawals: number;
        totalSalesCount: number;
        totalAffiliateSalesCount: number;
        pendingWithdrawalsCount: number;
        paidWithdrawalsCount: number;
    }>;
}

import { CommissionStatusEnum, WithdrawalStatusEnum } from '@prisma/client';
import { CreatePayoutMethodDto, UpdatePayoutMethodDto } from '../dto/create-payout-method.dto';
import { RequestWithdrawalDto } from '../dto/request-withdrawal.dto';
import { AffiliateService } from '../services/affiliate.service';
import { PayoutMethodService } from '../services/payout-method.service';
import { WalletService } from '../services/wallet.service';
import { WithdrawalService } from '../services/withdrawal.service';
/**
 * Self-service surface for sales employees.
 *
 * SECURITY: every route resolves the caller's own Affiliate row from the JWT `sub`.
 * No route accepts an affiliateId/employeeId from the client, so one employee can
 * never read or act on another's wallet, commissions or payout methods.
 */
export declare class AffiliateMeController {
    private readonly affiliateService;
    private readonly walletService;
    private readonly withdrawalService;
    private readonly payoutMethodService;
    constructor(affiliateService: AffiliateService, walletService: WalletService, withdrawalService: WithdrawalService, payoutMethodService: PayoutMethodService);
    getMe(user: any): Promise<{
        stats: {
            totalSales: number;
            pendingCommission: number;
            creditedCommission: number;
        };
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
    getMySales(user: any, page: number, limit: number): Promise<{
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
    getMyCommissions(user: any, page: number, limit: number, status?: CommissionStatusEnum): Promise<{
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
    getMyWallet(user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        affiliateId: string;
        pendingBalance: number;
        availableBalance: number;
        lifetimeEarned: number;
        lifetimeWithdrawn: number;
    }>;
    getMyWalletTransactions(user: any, page: number, limit: number): Promise<{
        data: {
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyWithdrawals(user: any, page: number, limit: number, status?: WithdrawalStatusEnum): Promise<{
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
    requestWithdrawal(user: any, dto: RequestWithdrawalDto): Promise<{
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
    getMyPayoutMethods(user: any): Promise<{
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
    }[]>;
    createPayoutMethod(user: any, dto: CreatePayoutMethodDto): Promise<{
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
    }>;
    updatePayoutMethod(user: any, id: string, dto: UpdatePayoutMethodDto): Promise<{
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
    }>;
    removePayoutMethod(user: any, id: string): Promise<{
        deleted: boolean;
    }>;
}

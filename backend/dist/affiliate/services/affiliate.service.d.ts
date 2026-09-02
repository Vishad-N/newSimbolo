import { Affiliate, AffiliateStatusEnum, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { AffiliateSettingsService } from './affiliate-settings.service';
import { AdminAffiliateListQueryDto, CreateAffiliateEmployeeDto } from '../dto/admin-list-query.dto';
export type AffiliateWithUser = Affiliate & {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
    };
};
export interface ValidateEmployeeCodeResult {
    valid: boolean;
    affiliate?: AffiliateWithUser;
    /** Display-safe name, e.g. "Rahul K." */
    displayName?: string;
    message?: string;
}
export declare class AffiliateService extends BaseService {
    private readonly prisma;
    private readonly auditService;
    private readonly settingsService;
    private static readonly CODE_GENERATION_MAX_ATTEMPTS;
    constructor(prisma: PrismaService, auditService: AuditService, settingsService: AffiliateSettingsService);
    /**
     * Server-side source of truth for whether an employee code may be applied to a
     * checkout. This is re-run independently at payment-order creation time — the
     * frontend's earlier /checkout/affiliate/validate call is treated as UX only and
     * is never trusted.
     *
     * @param code            raw user input (trimmed/uppercased internally)
     * @param requestingUserId the user the purchase is FOR (used for self-referral checks)
     */
    validateEmployeeCode(code: string, requestingUserId?: string): Promise<ValidateEmployeeCodeResult>;
    /** "Rahul Kumar" -> "Rahul K." — enough for the customer to recognise, no data leak. */
    private toDisplayName;
    /** Resolves the Affiliate profile owned by the authenticated user. 404 if none. */
    getMyAffiliateOrThrow(userId: string): Promise<Affiliate & {
        wallet: {
            id: string;
        } | null;
    }>;
    getMyProfile(userId: string): Promise<{
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
    /** Orders attributed to this affiliate (derived from Commission rows — the attribution record). */
    getMySales(userId: string, page?: number, limit?: number): Promise<{
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
                totalAmount: Prisma.Decimal;
                taxAmount: Prisma.Decimal;
                discountAmount: Prisma.Decimal;
                netAmount: Prisma.Decimal;
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
    getMyCommissions(userId: string, page?: number, limit?: number, status?: string): Promise<{
        data: ({
            order: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                currency: string;
                orderNumber: string;
                netAmount: Prisma.Decimal;
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
            metadata: Prisma.JsonValue | null;
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
    listSales(params: {
        affiliateId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
                totalAmount: Prisma.Decimal;
                taxAmount: Prisma.Decimal;
                discountAmount: Prisma.Decimal;
                netAmount: Prisma.Decimal;
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
    listCommissions(params: {
        affiliateId?: string;
        status?: Prisma.CommissionWhereInput['status'];
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            order: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                currency: string;
                orderNumber: string;
                netAmount: Prisma.Decimal;
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
            metadata: Prisma.JsonValue | null;
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
    /**
     * Flat row shape for the admin employee table/DataTable — deliberately NOT the raw
     * nested Prisma shape, to match what the admin dashboard renders directly.
     */
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
    /**
     * Full employee detail for the admin dashboard. Commission/wallet-ledger/withdrawal
     * history are embedded directly on the response (most recent 100 each) rather than
     * requiring separate paginated calls, since the admin detail page renders them as
     * simple, non-paginated tables.
     */
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
            metadata: Prisma.JsonValue | null;
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
            metadata: Prisma.JsonValue | null;
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
            metadata: Prisma.JsonValue | null;
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
    /**
     * Resolves the User to attach an Affiliate to: reuses dto.userId if given,
     * otherwise creates a fresh User (role AFFILIATE) from the inline fields.
     * Kept outside the code-generation retry loop below so a code collision retry
     * never re-creates the User.
     */
    private resolveEmployeeUserId;
    /**
     * Creates an Affiliate profile (with its Wallet) for a user — either an existing
     * user (dto.userId) or a brand-new one created inline from dto.email/firstName/
     * lastName/password. Inline creation lets HR onboard a sales employee without
     * first routing them through the client-facing user pool.
     * Affiliate and Wallet are created inside a single transaction — the invariant is
     * that every Affiliate ALWAYS has exactly one Wallet.
     */
    createEmployee(dto: CreateAffiliateEmployeeDto, options?: {
        actorUserId?: string;
    }): Promise<Affiliate>;
    setEmployeeStatus(id: string, status: AffiliateStatusEnum, actorUserId?: string): Promise<Affiliate>;
    /**
     * Soft-deletes a sales employee profile (sets `deletedAt`, flips to INACTIVE, and
     * stops future commission accrual). Never a hard delete — the Affiliate row stays
     * in place as the immutable owner of its Commission/WalletTransaction history, it
     * just disappears from active lists (all list/lookup queries already filter on
     * `deletedAt: null`) and the underlying user can no longer earn or withdraw.
     *
     * Financial safety guard: refuses to delete while there is money outstanding —
     * a non-zero wallet balance or a withdrawal still in flight — since deleting the
     * Affiliate would orphan that liability with no owner to pay it out to or reclaim
     * it from. The admin must resolve those first (pay out / cancel / write off).
     */
    deleteEmployee(id: string, actorUserId?: string): Promise<{
        deleted: true;
    }>;
    /** Stat-card aggregates for the admin affiliate dashboard. */
    getOverview(): Promise<{
        totalSales: number | Prisma.Decimal;
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
    /** Guards against a caller passing a code shaped like anything other than EMP-XXXXX. */
    assertCodeShape(code: string): string;
}

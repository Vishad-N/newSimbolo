import { Affiliate, AffiliateStatusEnum, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { AuditService } from '../../shared/audit/audit.service';
import { AffiliateSettingsService } from './affiliate-settings.service';
import { AdminAffiliateListQueryDto } from '../dto/admin-list-query.dto';
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
    getMyCommissions(userId: string, page?: number, limit?: number, status?: string): Promise<{
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
    /**
     * Creates an Affiliate profile (with its Wallet) for an existing user.
     * Affiliate and Wallet are created inside a single transaction — the invariant is
     * that every Affiliate ALWAYS has exactly one Wallet.
     */
    createEmployee(userId: string, options?: {
        commissionRate?: number;
        actorUserId?: string;
    }): Promise<Affiliate>;
    setEmployeeStatus(id: string, status: AffiliateStatusEnum, actorUserId?: string): Promise<Affiliate>;
    /** Stat-card aggregates for the admin affiliate dashboard. */
    getOverview(): Promise<{
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
    /** Guards against a caller passing a code shaped like anything other than EMP-XXXXX. */
    assertCodeShape(code: string): string;
}

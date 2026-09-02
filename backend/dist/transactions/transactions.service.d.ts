import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
export declare class TransactionsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(filters: {
        paymentId?: string;
        status?: string;
        type?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            payment: {
                order: {
                    client: {
                        user: {
                            email: string;
                            firstName: string;
                            lastName: string;
                        };
                    };
                    orderNumber: string;
                } | null;
                currency: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                paymentNumber: string;
                gatewayProvider: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            type: string;
            metadata: string | null;
            currency: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            transactionId: string;
            paymentId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        payment: {
            order: ({
                client: {
                    user: {
                        email: string;
                        id: string;
                        createdAt: Date;
                        passwordHash: string | null;
                        firstName: string;
                        lastName: string;
                        countryCode: string | null;
                        phone: string | null;
                        avatarUrl: string | null;
                        avatarMediaId: string | null;
                        status: import(".prisma/client").$Enums.UserStatusEnum;
                        roleId: string;
                        organizationId: string | null;
                        agencyId: string | null;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        createdBy: string | null;
                        updatedBy: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    status: string;
                    agencyId: string | null;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    state: string | null;
                    companyId: string | null;
                    accountManagerId: string | null;
                    gstNumber: string | null;
                    billingAddress: string | null;
                    timezone: string;
                    notes: string | null;
                    legalName: string | null;
                    stateCode: string | null;
                    pincode: string | null;
                    country: string | null;
                    gstRegistered: boolean;
                    gstinVerified: boolean;
                    gstinVerifiedAt: Date | null;
                };
            } & {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                notes: string | null;
                serviceId: string | null;
                packageId: string | null;
                currency: string;
                clientId: string;
                orderNumber: string;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                taxAmount: import("@prisma/client/runtime/library").Decimal;
                discountAmount: import("@prisma/client/runtime/library").Decimal;
                netAmount: import("@prisma/client/runtime/library").Decimal;
            }) | null;
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatusEnum;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            method: string | null;
            currency: string;
            orderId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentNumber: string;
            gatewayProvider: string;
            gatewayTransactionId: string | null;
            gatewayOrderId: string | null;
            invoiceId: string | null;
            paidAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        type: string;
        metadata: string | null;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string;
        paymentId: string;
    }>;
    findByPayment(paymentId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        type: string;
        metadata: string | null;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string;
        paymentId: string;
    }[]>;
    getRevenueAnalytics(startDate?: Date, endDate?: Date): Promise<{
        totalRevenue: number;
        totalCount: number;
        byType: Record<string, number>;
        currency: string;
    }>;
}

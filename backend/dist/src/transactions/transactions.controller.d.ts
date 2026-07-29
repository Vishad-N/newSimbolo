import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(page: number, limit: number, status?: string, type?: string, paymentId?: string, startDate?: string, endDate?: string): Promise<{
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
                amount: number;
                paymentNumber: string;
                gatewayProvider: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            type: string;
            currency: string;
            metadata: string | null;
            amount: number;
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
    getRevenueAnalytics(startDate?: string, endDate?: string): Promise<{
        totalRevenue: number;
        totalCount: number;
        byType: Record<string, number>;
        currency: string;
    }>;
    findByPayment(paymentId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        type: string;
        currency: string;
        metadata: string | null;
        amount: number;
        transactionId: string;
        paymentId: string;
    }[]>;
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
                        phone: string | null;
                        avatarUrl: string | null;
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
                    gstNumber: string | null;
                    billingAddress: string | null;
                    timezone: string;
                    companyId: string | null;
                    accountManagerId: string | null;
                    notes: string | null;
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
                totalAmount: number;
                taxAmount: number;
                discountAmount: number;
                netAmount: number;
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
            amount: number;
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
        currency: string;
        metadata: string | null;
        amount: number;
        transactionId: string;
        paymentId: string;
    }>;
}

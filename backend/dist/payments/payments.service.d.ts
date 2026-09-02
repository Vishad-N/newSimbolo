import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { RazorpayGateway } from './razorpay.provider';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { PaymentStatusEnum } from '@prisma/client';
import { AffiliateService } from '../affiliate/services/affiliate.service';
import { AffiliateSettingsService } from '../affiliate/services/affiliate-settings.service';
import { CommissionService } from '../affiliate/services/commission.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InvoicesService } from '../invoices/invoices.service';
export declare class PaymentsService extends BaseService {
    private readonly prisma;
    private readonly razorpayGateway;
    private readonly affiliateService;
    private readonly affiliateSettingsService;
    private readonly commissionService;
    private readonly notificationsService;
    private readonly invoicesService;
    constructor(prisma: PrismaService, razorpayGateway: RazorpayGateway, affiliateService: AffiliateService, affiliateSettingsService: AffiliateSettingsService, commissionService: CommissionService, notificationsService: NotificationsService, invoicesService: InvoicesService);
    private generatePaymentNumber;
    private generateTransactionId;
    /**
     * Creates a Razorpay gateway order and a pending Payment record.
     * Never trusts client-side amount — fetches from DB.
     */
    createPaymentOrder(dto: CreatePaymentOrderDto, requesterId?: string): Promise<{
        payment: {
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
        gatewayOrder: import("./razorpay.provider").GatewayOrderResult;
        keyId: string;
    }>;
    /**
     * Verifies Razorpay payment signature on the backend.
     * NEVER trusts client-side payment status.
     */
    verifyPayment(dto: VerifyPaymentDto, verifiedBy?: string): Promise<{
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
    }>;
    /**
     * Records a captured payment exactly once, no matter which of the two
     * independent paths gets there first: the client's own POST /payments/verify,
     * or Razorpay's payment.captured webhook. Both call this same method instead
     * of each running their own partial version, so subscription creation,
     * commission settlement, notifications, and invoicing can never be skipped
     * (if one path wins the race) or run twice (if both fire).
     *
     * Idempotency is enforced by the conditional update below — `updateMany` with
     * `status: { not: SUCCESSFUL }` only affects a row for whichever caller gets
     * there first, even under a genuine concurrent race, since Postgres resolves
     * the two UPDATEs serially. The loser sees `count === 0` and just returns the
     * already-settled payment instead of re-running any side effects.
     */
    finalizeSuccessfulPayment(payment: NonNullable<Awaited<ReturnType<PaymentsService['loadPaymentWithOrder']>>>, gatewayTransactionId: string, verifiedBy?: string): Promise<{
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
    }>;
    /** Shared payment-with-relations loader so the webhook and verifyPayment fetch identically shaped records. */
    loadPaymentWithOrder(gatewayOrderId: string): Promise<({
        order: ({
            client: {
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
    }) | null>;
    findAll(clientId?: string, status?: PaymentStatusEnum, page?: number, limit?: number): Promise<{
        data: ({
            order: {
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                client: {
                    user: {
                        email: string;
                        firstName: string;
                        lastName: string;
                    };
                };
                orderNumber: string;
            } | null;
            transactions: {
                id: string;
                createdAt: Date;
                status: string;
                type: string;
                metadata: string | null;
                currency: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                transactionId: string;
                paymentId: string;
            }[];
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        order: {
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
        } | null;
        invoice: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            type: import(".prisma/client").$Enums.InvoiceTypeEnum;
            currency: string;
            clientId: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            orderId: string | null;
            dueDate: Date;
            invoiceNumber: string;
            financialYear: string | null;
            supplyType: import(".prisma/client").$Enums.SupplyTypeEnum;
            taxTreatment: import(".prisma/client").$Enums.TaxTreatmentEnum;
            taxType: import(".prisma/client").$Enums.TaxTypeEnum;
            placeOfSupply: string | null;
            placeOfSupplyCode: string | null;
            reverseCharge: boolean;
            issueDate: Date;
            paidDate: Date | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            cgstAmount: import("@prisma/client/runtime/library").Decimal;
            sgstAmount: import("@prisma/client/runtime/library").Decimal;
            igstAmount: import("@prisma/client/runtime/library").Decimal;
            totalTax: import("@prisma/client/runtime/library").Decimal;
            subscriptionId: string | null;
            pdfAssetId: string | null;
            pdfUrl: string | null;
            irn: string | null;
            irnGeneratedAt: Date | null;
            signedQrCode: string | null;
            eInvoiceStatus: string | null;
            eInvoiceError: string | null;
        } | null;
        transactions: {
            id: string;
            createdAt: Date;
            status: string;
            type: string;
            metadata: string | null;
            currency: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            transactionId: string;
            paymentId: string;
        }[];
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
    }>;
    findMyPayments(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            order: {
                status: import(".prisma/client").$Enums.OrderStatusEnum;
                client: {
                    user: {
                        email: string;
                        firstName: string;
                        lastName: string;
                    };
                };
                orderNumber: string;
            } | null;
            transactions: {
                id: string;
                createdAt: Date;
                status: string;
                type: string;
                metadata: string | null;
                currency: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                transactionId: string;
                paymentId: string;
            }[];
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}

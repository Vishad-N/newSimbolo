import { PaymentsService } from './payments.service';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { PaymentStatusEnum } from '@prisma/client';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(dto: CreatePaymentOrderDto, req: any): Promise<{
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
            amount: number;
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
    verifyPayment(dto: VerifyPaymentDto, req: any): Promise<{
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
    }>;
    findAll(page: number, limit: number, status?: PaymentStatusEnum, clientId?: string): Promise<{
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
                amount: number;
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
            amount: number;
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
    findMyPayments(req: any, page: number, limit: number): Promise<{
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
                amount: number;
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
            amount: number;
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
            totalAmount: number;
            taxAmount: number;
            discountAmount: number;
            netAmount: number;
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
            totalAmount: number;
            taxAmount: number;
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
            subtotal: number;
            cgstAmount: number;
            sgstAmount: number;
            igstAmount: number;
            totalTax: number;
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
            amount: number;
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
        amount: number;
        paymentNumber: string;
        gatewayProvider: string;
        gatewayTransactionId: string | null;
        gatewayOrderId: string | null;
        invoiceId: string | null;
        paidAt: Date | null;
    }>;
}

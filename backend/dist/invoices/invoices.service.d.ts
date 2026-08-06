import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { EmailService } from '../shared/email/email.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './dto/invoice.dto';
import { InvoiceStatusEnum } from '@prisma/client';
export declare class InvoicesService extends BaseService {
    private readonly prisma;
    private readonly emailService;
    private readonly uploadsDir;
    constructor(prisma: PrismaService, emailService: EmailService);
    private generateInvoiceNumber;
    create(dto: CreateInvoiceDto, createdBy?: string): Promise<{
        order: {
            orderNumber: string;
        } | null;
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
            company: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                slug: string;
                gstNumber: string | null;
                billingAddress: string | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                logoUrl: string | null;
                primaryContactId: string | null;
            } | null;
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
        status: import(".prisma/client").$Enums.InvoiceStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        currency: string;
        clientId: string;
        totalAmount: number;
        taxAmount: number;
        orderId: string | null;
        dueDate: Date;
        invoiceNumber: string;
        issueDate: Date;
        paidDate: Date | null;
        subtotal: number;
        subscriptionId: string | null;
        pdfAssetId: string | null;
    }>;
    findAll(clientId?: string, status?: InvoiceStatusEnum, page?: number, limit?: number): Promise<{
        data: ({
            order: {
                orderNumber: string;
            } | null;
            client: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
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
            payments: {
                id: string;
                status: import(".prisma/client").$Enums.PaymentStatusEnum;
                amount: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            currency: string;
            clientId: string;
            totalAmount: number;
            taxAmount: number;
            orderId: string | null;
            dueDate: Date;
            invoiceNumber: string;
            issueDate: Date;
            paidDate: Date | null;
            subtotal: number;
            subscriptionId: string | null;
            pdfAssetId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        order: ({
            items: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                description: string | null;
                serviceId: string | null;
                packageId: string | null;
                orderId: string;
                quantity: number;
                unitPrice: number;
                totalPrice: number;
            }[];
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
            company: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                slug: string;
                gstNumber: string | null;
                billingAddress: string | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                logoUrl: string | null;
                primaryContactId: string | null;
            } | null;
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
        payments: {
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
        }[];
        pdfAsset: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            fileName: string;
            folderId: string | null;
            mediaType: import(".prisma/client").$Enums.MediaTypeEnum;
            storageKey: string;
            originalName: string;
            mimeType: string;
            fileExtension: string;
            sizeBytes: number;
            width: number | null;
            height: number | null;
            cdnUrl: string;
            storageBucket: string;
            uploaderId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        currency: string;
        clientId: string;
        totalAmount: number;
        taxAmount: number;
        orderId: string | null;
        dueDate: Date;
        invoiceNumber: string;
        issueDate: Date;
        paidDate: Date | null;
        subtotal: number;
        subscriptionId: string | null;
        pdfAssetId: string | null;
    }>;
    findMyInvoices(userId: string, status?: InvoiceStatusEnum, page?: number, limit?: number): Promise<{
        data: ({
            order: {
                orderNumber: string;
            } | null;
            client: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
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
            payments: {
                id: string;
                status: import(".prisma/client").$Enums.PaymentStatusEnum;
                amount: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatusEnum;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            currency: string;
            clientId: string;
            totalAmount: number;
            taxAmount: number;
            orderId: string | null;
            dueDate: Date;
            invoiceNumber: string;
            issueDate: Date;
            paidDate: Date | null;
            subtotal: number;
            subscriptionId: string | null;
            pdfAssetId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateStatus(id: string, dto: UpdateInvoiceStatusDto, updatedBy?: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        currency: string;
        clientId: string;
        totalAmount: number;
        taxAmount: number;
        orderId: string | null;
        dueDate: Date;
        invoiceNumber: string;
        issueDate: Date;
        paidDate: Date | null;
        subtotal: number;
        subscriptionId: string | null;
        pdfAssetId: string | null;
    }>;
    generatePdf(id: string): Promise<Buffer>;
    emailInvoice(id: string): Promise<{
        sent: boolean;
    }>;
    softDelete(id: string, deletedBy?: string): Promise<{
        message: string;
    }>;
}

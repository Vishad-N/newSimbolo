import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceStatusDto } from './dto/invoice.dto';
import { InvoiceStatusEnum } from '@prisma/client';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    create(dto: CreateInvoiceDto, req: any): Promise<{
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
    findAll(page: number, limit: number, status?: InvoiceStatusEnum, clientId?: string): Promise<{
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
    findMyInvoices(req: any, page: number, limit: number, status?: InvoiceStatusEnum): Promise<{
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
    downloadPdf(id: string, res: Response): Promise<void>;
    emailInvoice(id: string): Promise<{
        sent: boolean;
    }>;
    updateStatus(id: string, dto: UpdateInvoiceStatusDto, req: any): Promise<{
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
    softDelete(id: string, req: any): Promise<{
        message: string;
    }>;
}

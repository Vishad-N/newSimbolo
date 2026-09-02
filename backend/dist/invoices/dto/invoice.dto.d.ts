import { InvoiceStatusEnum } from '@prisma/client';
export declare class InvoiceItemDto {
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    sacCode?: string;
    gstRate?: number;
}
export declare class CreateInvoiceDto {
    clientId: string;
    orderId?: string;
    subscriptionId?: string;
    dueDate: string;
    items: InvoiceItemDto[];
    taxPercentage?: number;
    currency?: string;
    notes?: string;
}
export declare class UpdateInvoiceStatusDto {
    status: InvoiceStatusEnum;
}

import { OrderStatusEnum } from '@prisma/client';
export declare class CreateOrderDto {
    clientId: string;
    packageId?: string;
    serviceId?: string;
    totalAmount: number;
    taxAmount?: number;
    discountAmount?: number;
    netAmount: number;
    currency?: string;
    notes?: string;
    status?: OrderStatusEnum;
}

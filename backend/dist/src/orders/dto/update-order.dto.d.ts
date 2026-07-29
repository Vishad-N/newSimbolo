import { OrderStatusEnum } from '@prisma/client';
export declare class UpdateOrderDto {
    status?: OrderStatusEnum;
    notes?: string;
    totalAmount?: number;
    taxAmount?: number;
    discountAmount?: number;
    netAmount?: number;
}

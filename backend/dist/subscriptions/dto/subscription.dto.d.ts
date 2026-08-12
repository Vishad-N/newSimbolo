import { SubscriptionIntervalEnum, SubscriptionStatusEnum } from '@prisma/client';
export declare class CreateSubscriptionDto {
    clientId: string;
    packageId: string;
    interval?: SubscriptionIntervalEnum;
    price: number;
    currency?: string;
    currentPeriodStart?: string;
    razorpaySubscriptionId?: string;
}
export declare class UpdateSubscriptionDto {
    status?: SubscriptionStatusEnum;
    packageId?: string;
    price?: number;
    cancelAtPeriodEnd?: boolean;
}

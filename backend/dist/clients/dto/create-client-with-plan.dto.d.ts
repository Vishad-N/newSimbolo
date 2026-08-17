import { SubscriptionIntervalEnum } from '@prisma/client';
export declare class CreateClientWithPlanDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    countryCode?: string;
    phone?: string;
    companyId?: string;
    accountManagerId?: string;
    gstNumber?: string;
    billingAddress?: string;
    timezone?: string;
    notes?: string;
    packageId?: string;
    interval?: SubscriptionIntervalEnum;
    price?: number;
    currency?: string;
    currentPeriodStart?: string;
}

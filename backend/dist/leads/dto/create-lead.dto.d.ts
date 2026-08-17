import { LeadStatusEnum } from '@prisma/client';
export declare class CreateLeadDto {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    company?: string;
    service?: string;
    message: string;
    status?: LeadStatusEnum;
}

import { UserStatusEnum } from '@prisma/client';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    countryCode?: string;
    phone?: string;
    avatarUrl?: string;
    status?: UserStatusEnum;
    roleId?: string;
    organizationId?: string;
}

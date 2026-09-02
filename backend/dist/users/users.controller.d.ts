import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateStaffUserDto } from './dto/create-staff-user.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserStatusEnum } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: JwtPayload): Promise<{
        email: string;
        role: {
            id: string;
            name: string;
            slug: string;
            permissions: {
                id: string;
                name: string;
                slug: string;
                module: string;
            }[];
        };
        clientProfile: ({
            company: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                state: string | null;
                slug: string;
                gstNumber: string | null;
                billingAddress: string | null;
                legalName: string | null;
                stateCode: string | null;
                pincode: string | null;
                country: string | null;
                gstRegistered: boolean;
                gstinVerified: boolean;
                gstinVerifiedAt: Date | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                logoUrl: string | null;
                logoMediaId: string | null;
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
            state: string | null;
            companyId: string | null;
            accountManagerId: string | null;
            gstNumber: string | null;
            billingAddress: string | null;
            timezone: string;
            notes: string | null;
            legalName: string | null;
            stateCode: string | null;
            pincode: string | null;
            country: string | null;
            gstRegistered: boolean;
            gstinVerified: boolean;
            gstinVerifiedAt: Date | null;
        }) | null;
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        countryCode: string | null;
        phone: string | null;
        avatarUrl: string | null;
        status: import(".prisma/client").$Enums.UserStatusEnum;
        organizationId: string | null;
        updatedAt: Date;
    }>;
    updateProfile(user: JwtPayload, dto: UpdateUserDto): Promise<{
        email: string;
        role: {
            id: string;
            name: string;
            slug: string;
        };
        id: string;
        firstName: string;
        lastName: string;
        countryCode: string | null;
        phone: string | null;
        avatarUrl: string | null;
        status: import(".prisma/client").$Enums.UserStatusEnum;
    }>;
    changePassword(user: JwtPayload, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    findAll(page: number, limit: number, search?: string, roleId?: string, status?: UserStatusEnum): Promise<{
        data: {
            email: string;
            role: {
                id: string;
                name: string;
                slug: string;
            };
            id: string;
            createdAt: Date;
            firstName: string;
            lastName: string;
            countryCode: string | null;
            phone: string | null;
            avatarUrl: string | null;
            status: import(".prisma/client").$Enums.UserStatusEnum;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createStaffUser(dto: CreateStaffUserDto, user: JwtPayload): Promise<{
        email: string;
        role: {
            id: string;
            name: string;
            slug: string;
        };
        id: string;
        firstName: string;
        lastName: string;
        status: import(".prisma/client").$Enums.UserStatusEnum;
    }>;
    findOne(id: string): Promise<{
        email: string;
        role: {
            id: string;
            name: string;
            slug: string;
            permissions: {
                id: string;
                name: string;
                slug: string;
                module: string;
            }[];
        };
        clientProfile: ({
            company: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                deletedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                state: string | null;
                slug: string;
                gstNumber: string | null;
                billingAddress: string | null;
                legalName: string | null;
                stateCode: string | null;
                pincode: string | null;
                country: string | null;
                gstRegistered: boolean;
                gstinVerified: boolean;
                gstinVerifiedAt: Date | null;
                website: string | null;
                industry: string | null;
                size: string | null;
                logoUrl: string | null;
                logoMediaId: string | null;
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
            state: string | null;
            companyId: string | null;
            accountManagerId: string | null;
            gstNumber: string | null;
            billingAddress: string | null;
            timezone: string;
            notes: string | null;
            legalName: string | null;
            stateCode: string | null;
            pincode: string | null;
            country: string | null;
            gstRegistered: boolean;
            gstinVerified: boolean;
            gstinVerifiedAt: Date | null;
        }) | null;
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        countryCode: string | null;
        phone: string | null;
        avatarUrl: string | null;
        status: import(".prisma/client").$Enums.UserStatusEnum;
        organizationId: string | null;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto, user: JwtPayload): Promise<{
        email: string;
        role: {
            id: string;
            name: string;
            slug: string;
        };
        id: string;
        firstName: string;
        lastName: string;
        countryCode: string | null;
        phone: string | null;
        avatarUrl: string | null;
        status: import(".prisma/client").$Enums.UserStatusEnum;
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        success: boolean;
        message: string;
    }>;
}

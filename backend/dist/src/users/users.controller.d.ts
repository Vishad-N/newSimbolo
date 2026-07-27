import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
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
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
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
        phone: string | null;
        avatarUrl: string | null;
        status: import(".prisma/client").$Enums.UserStatusEnum;
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        success: boolean;
        message: string;
    }>;
}

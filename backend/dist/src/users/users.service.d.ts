import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../shared/audit/audit.service';
import { SessionsService } from '../sessions/sessions.service';
import { UserStatusEnum } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersService extends BaseService {
    private readonly prisma;
    private readonly auditService;
    private readonly sessionsService;
    constructor(prisma: PrismaService, auditService: AuditService, sessionsService: SessionsService);
    findAll(page?: number, limit?: number, search?: string, roleId?: string, status?: UserStatusEnum): Promise<{
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
    findByEmail(email: string): Promise<({
        role: {
            permissions: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                description: string | null;
                slug: string;
                module: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            type: import(".prisma/client").$Enums.RoleTypeEnum;
            description: string | null;
            slug: string;
        };
    } & {
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
    }) | null>;
    findById(id: string): Promise<{
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
    update(id: string, dto: UpdateUserDto, updatedBy?: string): Promise<{
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
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: string, deletedBy?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

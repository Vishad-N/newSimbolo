import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AuditService } from '../shared/audit/audit.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, AssignPermissionsDto } from './dto/update-role.dto';
export declare class RolesService extends BaseService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    findAll(): Promise<({
        _count: {
            users: number;
        };
        permissions: {
            id: string;
            name: string;
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
    })[]>;
    findOne(id: string): Promise<NonNullable<{
        _count: {
            users: number;
        };
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
    }>>;
    create(dto: CreateRoleDto, userId?: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateRoleDto, userId?: string): Promise<{
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
    }>;
    remove(id: string, userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    assignPermissions(id: string, dto: AssignPermissionsDto, userId?: string): Promise<{
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
    }>;
}

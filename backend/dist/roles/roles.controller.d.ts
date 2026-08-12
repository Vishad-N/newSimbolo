import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, AssignPermissionsDto } from './dto/update-role.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
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
    create(dto: CreateRoleDto, user: JwtPayload): Promise<{
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
    update(id: string, dto: UpdateRoleDto, user: JwtPayload): Promise<{
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
    remove(id: string, user: JwtPayload): Promise<{
        success: boolean;
        message: string;
    }>;
    assignPermissions(id: string, dto: AssignPermissionsDto, user: JwtPayload): Promise<{
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

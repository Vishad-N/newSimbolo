"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RolesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const audit_service_1 = require("../shared/audit/audit.service");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let RolesService = RolesService_1 = class RolesService extends base_service_1.BaseService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        super(RolesService_1.name);
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async findAll() {
        this.logger.debug('Retrieving all roles');
        return this.prisma.role.findMany({
            orderBy: [{ type: 'asc' }, { name: 'asc' }],
            include: {
                permissions: {
                    select: { id: true, name: true, slug: true, module: true },
                },
                _count: {
                    select: { users: true },
                },
            },
        });
    }
    async findOne(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: true,
                _count: {
                    select: { users: true },
                },
            },
        });
        return this.checkEntityExists(role, 'Role', id);
    }
    async create(dto, userId) {
        this.logger.debug(`Creating new role: ${dto.name}`);
        const existingRole = await this.prisma.role.findFirst({
            where: {
                OR: [{ name: dto.name }, { slug: dto.slug.toUpperCase() }],
            },
        });
        if (existingRole) {
            throw new custom_exceptions_1.CustomConflictException('A role with this name or slug already exists');
        }
        const permissionConnect = dto.permissionIds ? dto.permissionIds.map((id) => ({ id })) : [];
        const role = await this.prisma.role.create({
            data: {
                name: dto.name,
                slug: dto.slug.toUpperCase(),
                description: dto.description,
                type: client_1.RoleTypeEnum.CUSTOM,
                createdBy: userId,
                permissions: {
                    connect: permissionConnect,
                },
            },
            include: { permissions: true },
        });
        await this.auditService.logEvent({
            userId,
            action: 'ROLE_CREATED',
            entityType: 'Role',
            entityId: role.id,
            newValue: { name: role.name, slug: role.slug, permissions: dto.permissionIds },
        });
        return role;
    }
    async update(id, dto, userId) {
        this.logger.debug(`Updating role: ${id}`);
        const role = await this.findOne(id);
        if (dto.name && dto.name !== role.name) {
            const existing = await this.prisma.role.findUnique({ where: { name: dto.name } });
            if (existing && existing.id !== id) {
                throw new custom_exceptions_1.CustomConflictException('A role with this name already exists');
            }
        }
        const updateData = {
            name: dto.name,
            description: dto.description,
            updatedBy: userId,
        };
        if (dto.permissionIds) {
            updateData.permissions = {
                set: dto.permissionIds.map((permId) => ({ id: permId })),
            };
        }
        const updatedRole = await this.prisma.role.update({
            where: { id },
            data: updateData,
            include: { permissions: true },
        });
        await this.auditService.logEvent({
            userId,
            action: 'ROLE_UPDATED',
            entityType: 'Role',
            entityId: id,
            oldValue: { name: role.name, description: role.description },
            newValue: { name: updatedRole.name, description: updatedRole.description },
        });
        return updatedRole;
    }
    async remove(id, userId) {
        this.logger.debug(`Deleting role: ${id}`);
        const role = await this.findOne(id);
        if (role.type === client_1.RoleTypeEnum.SYSTEM) {
            throw new custom_exceptions_1.CustomForbiddenException('System roles cannot be deleted.');
        }
        if (role._count && role._count.users > 0) {
            throw new custom_exceptions_1.BusinessException(`Cannot delete role "${role.name}" because it is currently assigned to ${role._count.users} user(s).`);
        }
        await this.prisma.role.delete({ where: { id } });
        await this.auditService.logEvent({
            userId,
            action: 'ROLE_DELETED',
            entityType: 'Role',
            entityId: id,
            oldValue: { name: role.name, slug: role.slug },
        });
        return { success: true, message: `Role "${role.name}" deleted successfully` };
    }
    async assignPermissions(id, dto, userId) {
        this.logger.debug(`Assigning ${dto.permissionIds.length} permissions to role: ${id}`);
        await this.findOne(id);
        const updatedRole = await this.prisma.role.update({
            where: { id },
            data: {
                permissions: {
                    set: dto.permissionIds.map((permId) => ({ id: permId })),
                },
                updatedBy: userId,
            },
            include: { permissions: true },
        });
        await this.auditService.logEvent({
            userId,
            action: 'ROLE_PERMISSIONS_ASSIGNED',
            entityType: 'Role',
            entityId: id,
            newValue: { permissionIds: dto.permissionIds },
        });
        return updatedRole;
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], RolesService);
//# sourceMappingURL=roles.service.js.map
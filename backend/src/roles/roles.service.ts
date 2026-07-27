import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AuditService } from '../shared/audit/audit.service';
import { RoleTypeEnum } from '@prisma/client';
import {
  CustomConflictException,
  CustomForbiddenException,
  BusinessException,
} from '../common/exceptions/custom.exceptions';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, AssignPermissionsDto } from './dto/update-role.dto';

@Injectable()
export class RolesService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {
    super(RolesService.name);
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

  async findOne(id: string) {
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

  async create(dto: CreateRoleDto, userId?: string) {
    this.logger.debug(`Creating new role: ${dto.name}`);
    const existingRole = await this.prisma.role.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug: dto.slug.toUpperCase() }],
      },
    });

    if (existingRole) {
      throw new CustomConflictException('A role with this name or slug already exists');
    }

    const permissionConnect = dto.permissionIds ? dto.permissionIds.map((id) => ({ id })) : [];
    const role = await this.prisma.role.create({
      data: {
        name: dto.name,
        slug: dto.slug.toUpperCase(),
        description: dto.description,
        type: RoleTypeEnum.CUSTOM,
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

  async update(id: string, dto: UpdateRoleDto, userId?: string) {
    this.logger.debug(`Updating role: ${id}`);
    const role = await this.findOne(id);

    if (dto.name && dto.name !== role.name) {
      const existing = await this.prisma.role.findUnique({ where: { name: dto.name } });
      if (existing && existing.id !== id) {
        throw new CustomConflictException('A role with this name already exists');
      }
    }

    const updateData: any = {
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

  async remove(id: string, userId?: string) {
    this.logger.debug(`Deleting role: ${id}`);
    const role = await this.findOne(id);

    if (role.type === RoleTypeEnum.SYSTEM) {
      throw new CustomForbiddenException('System roles cannot be deleted.');
    }

    if (role._count && role._count.users > 0) {
      throw new BusinessException(
        `Cannot delete role "${role.name}" because it is currently assigned to ${role._count.users} user(s).`,
      );
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

  async assignPermissions(id: string, dto: AssignPermissionsDto, userId?: string) {
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
}

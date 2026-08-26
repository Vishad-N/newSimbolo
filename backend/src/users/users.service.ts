import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../shared/audit/audit.service';
import { SessionsService } from '../sessions/sessions.service';
import { UserStatusEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CustomUnauthorizedException, BusinessException } from '../common/exceptions/custom.exceptions';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateStaffUserDto } from './dto/create-staff-user.dto';
import { CustomConflictException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly sessionsService: SessionsService,
  ) {
    super(UsersService.name);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, roleId?: string, status?: UserStatusEnum) {
    this.logger.debug(`Retrieving users list (page: ${page}, limit: ${limit})`);
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (roleId) {
      where.roleId = roleId;
    }
    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          countryCode: true,
          phone: true,
          avatarUrl: true,
          status: true,
          createdAt: true,
          role: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createStaffUser(dto: CreateStaffUserDto, createdBy?: string) {
    this.logger.debug(`Creating staff user account: ${dto.email}`);

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new CustomConflictException(`A user with email "${dto.email}" already exists`);
    }

    const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
    if (!role) {
      throw new BusinessException('Assigned role does not exist.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: dto.roleId,
        status: UserStatusEnum.ACTIVE,
        createdBy,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        role: { select: { id: true, name: true, slug: true } },
      },
    });

    await this.auditService.logEvent({
      userId: createdBy,
      action: 'STAFF_USER_CREATED',
      entityType: 'User',
      entityId: user.id,
      newValue: { email: user.email, roleId: dto.roleId },
    });

    return user;
  }

  async findByEmail(email: string) {
    this.logger.debug(`Searching user by email: ${email}`);
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: { include: { permissions: true } },
      },
    });
  }

  async findById(id: string) {
    this.logger.debug(`Searching user by id: ${id}`);
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        countryCode: true,
        phone: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        organizationId: true,
        role: {
          select: {
            id: true,
            name: true,
            slug: true,
            permissions: { select: { id: true, name: true, slug: true, module: true } },
          },
        },
        clientProfile: {
          include: {
            company: true,
          },
        },
      },
    });
    return this.checkEntityExists(user, 'User', id);
  }

  async update(id: string, dto: UpdateUserDto, updatedBy?: string) {
    this.logger.debug(`Updating user: ${id}`);
    const user = this.checkEntityExists(await this.prisma.user.findUnique({ where: { id } }), 'User', id);

    if (dto.roleId && dto.roleId !== user.roleId) {
      const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
      if (!role) {
        throw new BusinessException('Assigned role does not exist.');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        updatedBy,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        countryCode: true,
        phone: true,
        avatarUrl: true,
        status: true,
        role: { select: { id: true, name: true, slug: true } },
      },
    });

    await this.auditService.logEvent({
      userId: updatedBy,
      action: 'USER_UPDATED',
      entityType: 'User',
      entityId: id,
      oldValue: { firstName: user.firstName, lastName: user.lastName, status: user.status, roleId: user.roleId },
      newValue: dto,
    });

    return updatedUser;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    this.logger.debug(`Changing password for user: ${userId}`);
    const user = this.checkEntityExists(await this.prisma.user.findUnique({ where: { id: userId } }), 'User', userId);

    if (!user.passwordHash) {
      throw new BusinessException('Your account uses Google OAuth. Password change is not applicable.');
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      await this.auditService.logEvent({
        userId,
        action: 'PASSWORD_CHANGE_FAILED',
        entityType: 'User',
        entityId: userId,
        newValue: 'Incorrect current password',
      });
      throw new CustomUnauthorizedException('Current password is not correct');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.sessionsService.terminateAllSessions(userId);

    await this.auditService.logEvent({
      userId,
      action: 'PASSWORD_CHANGED',
      entityType: 'User',
      entityId: userId,
    });

    return { success: true, message: 'Password changed successfully. All other sessions have been logged out.' };
  }

  async remove(id: string, deletedBy?: string) {
    this.logger.debug(`Soft deleting user: ${id}`);
    const user = this.checkEntityExists(await this.prisma.user.findUnique({ where: { id } }), 'User', id);

    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: UserStatusEnum.INACTIVE,
        updatedBy: deletedBy,
      },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.sessionsService.terminateAllSessions(id);

    await this.auditService.logEvent({
      userId: deletedBy,
      action: 'USER_DELETED',
      entityType: 'User',
      entityId: id,
      oldValue: { email: user.email, status: user.status },
    });

    return { success: true, message: `User account deleted successfully` };
  }
}

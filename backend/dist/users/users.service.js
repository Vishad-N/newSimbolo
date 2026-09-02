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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../shared/audit/audit.service");
const sessions_service_1 = require("../sessions/sessions.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
const custom_exceptions_2 = require("../common/exceptions/custom.exceptions");
let UsersService = UsersService_1 = class UsersService extends base_service_1.BaseService {
    prisma;
    auditService;
    sessionsService;
    constructor(prisma, auditService, sessionsService) {
        super(UsersService_1.name);
        this.prisma = prisma;
        this.auditService = auditService;
        this.sessionsService = sessionsService;
    }
    async findAll(page = 1, limit = 10, search, roleId, status) {
        this.logger.debug(`Retrieving users list (page: ${page}, limit: ${limit})`);
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
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
    async createStaffUser(dto, createdBy) {
        this.logger.debug(`Creating staff user account: ${dto.email}`);
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new custom_exceptions_2.CustomConflictException(`A user with email "${dto.email}" already exists`);
        }
        const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
        if (!role) {
            throw new custom_exceptions_1.BusinessException('Assigned role does not exist.');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                roleId: dto.roleId,
                status: client_1.UserStatusEnum.ACTIVE,
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
    async findByEmail(email) {
        this.logger.debug(`Searching user by email: ${email}`);
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                role: { include: { permissions: true } },
            },
        });
    }
    async findById(id) {
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
    async update(id, dto, updatedBy) {
        this.logger.debug(`Updating user: ${id}`);
        const user = this.checkEntityExists(await this.prisma.user.findUnique({ where: { id } }), 'User', id);
        if (dto.roleId && dto.roleId !== user.roleId) {
            const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
            if (!role) {
                throw new custom_exceptions_1.BusinessException('Assigned role does not exist.');
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
    async changePassword(userId, dto) {
        this.logger.debug(`Changing password for user: ${userId}`);
        const user = this.checkEntityExists(await this.prisma.user.findUnique({ where: { id: userId } }), 'User', userId);
        if (!user.passwordHash) {
            throw new custom_exceptions_1.BusinessException('Your account uses Google OAuth. Password change is not applicable.');
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
            throw new custom_exceptions_1.CustomUnauthorizedException('Current password is not correct');
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
    async remove(id, deletedBy) {
        this.logger.debug(`Soft deleting user: ${id}`);
        const user = this.checkEntityExists(await this.prisma.user.findUnique({ where: { id } }), 'User', id);
        await this.prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                status: client_1.UserStatusEnum.INACTIVE,
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        sessions_service_1.SessionsService])
], UsersService);
//# sourceMappingURL=users.service.js.map
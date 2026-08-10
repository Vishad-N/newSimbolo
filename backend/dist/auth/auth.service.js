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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const email_service_1 = require("../shared/email/email.service");
const audit_service_1 = require("../shared/audit/audit.service");
const sessions_service_1 = require("../sessions/sessions.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let AuthService = AuthService_1 = class AuthService extends base_service_1.BaseService {
    prisma;
    jwtService;
    configService;
    emailService;
    auditService;
    sessionsService;
    bcryptRounds;
    jwtSecret;
    jwtExpiresIn;
    jwtRefreshSecret;
    jwtRefreshExpiresIn;
    constructor(prisma, jwtService, configService, emailService, auditService, sessionsService) {
        super(AuthService_1.name);
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
        this.auditService = auditService;
        this.sessionsService = sessionsService;
        this.bcryptRounds = this.configService.get('auth.bcryptRounds', 12);
        this.jwtSecret = this.configService.get('auth.jwtSecret', 'default-secret-change-me');
        this.jwtExpiresIn = this.configService.get('auth.jwtExpiresIn', '15m');
        this.jwtRefreshSecret = this.configService.get('auth.jwtRefreshSecret', 'default-refresh-secret-change-me');
        this.jwtRefreshExpiresIn = this.configService.get('auth.jwtRefreshExpiresIn', '7d');
    }
    async register(dto, ip, userAgent) {
        this.logger.debug(`Registering user with email: ${dto.email}`);
        const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) {
            throw new custom_exceptions_1.CustomConflictException('A user with this email address already exists');
        }
        const clientRole = await this.prisma.role.findUnique({ where: { slug: 'CLIENT' } });
        if (!clientRole) {
            throw new custom_exceptions_1.BusinessException('Default CLIENT role is not initialized in system. Please run database seeding.');
        }
        const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                status: client_1.UserStatusEnum.PENDING_VERIFICATION,
                roleId: clientRole.id,
            },
        });
        const tokenString = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await this.prisma.verificationToken.create({
            data: {
                identifier: user.email,
                token: tokenString,
                expiresAt,
            },
        });
        await this.emailService.sendVerificationEmail(user.email, tokenString);
        await this.auditService.logEvent({
            userId: user.id,
            action: 'REGISTRATION',
            entityType: 'User',
            entityId: user.id,
            ipAddress: ip,
            userAgent,
        });
        return {
            success: true,
            message: 'Registration successful. Please check your email to verify your account.',
            data: {
                userId: user.id,
                email: user.email,
                status: user.status,
            },
        };
    }
    async login(dto, ip, userAgent) {
        this.logger.debug(`Login attempt for email: ${dto.email}`);
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                role: {
                    include: { permissions: true },
                },
            },
        });
        if (!user || !user.passwordHash) {
            await this.auditService.logEvent({
                action: 'LOGIN_FAILED',
                entityType: 'User',
                entityId: dto.email,
                ipAddress: ip,
                userAgent,
                newValue: 'Invalid email or missing password',
            });
            throw new custom_exceptions_1.CustomUnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            await this.auditService.logEvent({
                userId: user.id,
                action: 'LOGIN_FAILED',
                entityType: 'User',
                entityId: user.id,
                ipAddress: ip,
                userAgent,
                newValue: 'Invalid password',
            });
            throw new custom_exceptions_1.CustomUnauthorizedException('Invalid email or password');
        }
        if (user.status === client_1.UserStatusEnum.SUSPENDED || user.status === client_1.UserStatusEnum.INACTIVE) {
            throw new custom_exceptions_1.CustomForbiddenException(`Your account is currently ${user.status.toLowerCase()}. Please contact support.`);
        }
        const permissionSlugs = user.role.permissions ? user.role.permissions.map((p) => p.slug) : [];
        const tokens = await this.generateTokens(user.id, user.email, user.role.slug, permissionSlugs, user.organizationId || undefined);
        const refreshTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: refreshTokenHash,
                expiresAt: refreshExpiresAt,
                ipAddress: ip,
                userAgent,
            },
        });
        const sessionToken = crypto.randomBytes(24).toString('hex');
        await this.sessionsService.createSession(user.id, sessionToken, refreshExpiresAt, ip, userAgent);
        await this.auditService.logEvent({
            userId: user.id,
            action: 'LOGIN',
            entityType: 'User',
            entityId: user.id,
            ipAddress: ip,
            userAgent,
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            sessionToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl,
                status: user.status,
                role: user.role.slug,
                permissions: permissionSlugs,
                organizationId: user.organizationId,
            },
        };
    }
    async refreshToken(dto, ip, userAgent) {
        this.logger.debug('Refreshing access token');
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: this.jwtRefreshSecret,
            });
        }
        catch (error) {
            throw new custom_exceptions_1.CustomUnauthorizedException('Invalid or expired refresh token');
        }
        const tokenHash = crypto.createHash('sha256').update(dto.refreshToken).digest('hex');
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
        });
        if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
            if (storedToken && storedToken.revokedAt) {
                this.logger.warn(`🚨 Attempted reuse of revoked refresh token for user ${payload.sub}`);
                await this.prisma.refreshToken.updateMany({
                    where: { userId: payload.sub, revokedAt: null },
                    data: { revokedAt: new Date() },
                });
            }
            throw new custom_exceptions_1.CustomUnauthorizedException('Invalid or expired refresh token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { role: { include: { permissions: true } } },
        });
        if (!user || user.status === client_1.UserStatusEnum.SUSPENDED || user.status === client_1.UserStatusEnum.INACTIVE) {
            throw new custom_exceptions_1.CustomForbiddenException('User account is suspended or inactive');
        }
        // Rotate token
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
        });
        const permissionSlugs = user.role.permissions ? user.role.permissions.map((p) => p.slug) : [];
        const newTokens = await this.generateTokens(user.id, user.email, user.role.slug, permissionSlugs, user.organizationId || undefined);
        const newHash = crypto.createHash('sha256').update(newTokens.refreshToken).digest('hex');
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: newHash,
                expiresAt: refreshExpiresAt,
                ipAddress: ip,
                userAgent,
            },
        });
        return {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
        };
    }
    async logout(userId, refreshToken, sessionToken) {
        this.logger.debug(`Logging out user ${userId}`);
        if (refreshToken) {
            const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            await this.prisma.refreshToken.updateMany({
                where: { userId, tokenHash, revokedAt: null },
                data: { revokedAt: new Date() },
            });
        }
        else {
            await this.prisma.refreshToken.updateMany({
                where: { userId, revokedAt: null },
                data: { revokedAt: new Date() },
            });
        }
        if (sessionToken) {
            await this.prisma.session.deleteMany({
                where: { userId, sessionToken },
            });
        }
        await this.auditService.logEvent({
            userId,
            action: 'LOGOUT',
            entityType: 'User',
            entityId: userId,
        });
        return { success: true, message: 'Logged out successfully' };
    }
    async forgotPassword(dto, ip, userAgent) {
        this.logger.debug(`Password reset requested for: ${dto.email}`);
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (user && user.status !== client_1.UserStatusEnum.SUSPENDED) {
            await this.prisma.passwordResetToken.deleteMany({ where: { email: dto.email } });
            const tokenString = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await this.prisma.passwordResetToken.create({
                data: {
                    email: dto.email,
                    token: tokenString,
                    expiresAt,
                },
            });
            await this.emailService.sendPasswordResetEmail(user.email, tokenString);
            await this.auditService.logEvent({
                userId: user.id,
                action: 'PASSWORD_RESET_REQUESTED',
                entityType: 'User',
                entityId: user.id,
                ipAddress: ip,
                userAgent,
            });
        }
        // Always return success to prevent user enumeration
        return {
            success: true,
            message: 'If an account exists with this email address, a password reset link has been sent.',
        };
    }
    async resetPassword(dto, ip, userAgent) {
        this.logger.debug('Resetting password via token');
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token: dto.token },
        });
        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            throw new custom_exceptions_1.BusinessException('This password reset token is invalid or has expired.');
        }
        const user = await this.prisma.user.findUnique({ where: { email: resetToken.email } });
        if (!user) {
            throw new custom_exceptions_1.BusinessException('User associated with this reset token no longer exists.');
        }
        const newHash = await bcrypt.hash(dto.newPassword, this.bcryptRounds);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash },
        });
        await this.prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { usedAt: new Date() },
        });
        await this.prisma.refreshToken.updateMany({
            where: { userId: user.id, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        await this.sessionsService.terminateAllSessions(user.id);
        await this.auditService.logEvent({
            userId: user.id,
            action: 'PASSWORD_RESET_COMPLETED',
            entityType: 'User',
            entityId: user.id,
            ipAddress: ip,
            userAgent,
        });
        return {
            success: true,
            message: 'Password reset successfully. Please log in with your new password.',
        };
    }
    async verifyEmail(dto, ip, userAgent) {
        this.logger.debug(`Verifying email token for: ${dto.email}`);
        const tokenRecord = await this.prisma.verificationToken.findUnique({
            where: {
                identifier_token: {
                    identifier: dto.email,
                    token: dto.token,
                },
            },
        });
        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new custom_exceptions_1.BusinessException('Verification link is invalid or has expired.');
        }
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new custom_exceptions_1.BusinessException('User account no longer exists.');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { status: client_1.UserStatusEnum.ACTIVE },
        });
        await this.prisma.verificationToken.delete({
            where: { id: tokenRecord.id },
        });
        await this.emailService.sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`);
        await this.auditService.logEvent({
            userId: user.id,
            action: 'EMAIL_VERIFIED',
            entityType: 'User',
            entityId: user.id,
            ipAddress: ip,
            userAgent,
        });
        return {
            success: true,
            message: 'Email verified successfully. Your account is now active.',
        };
    }
    async resendVerificationEmail(dto, ip, userAgent) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (user && user.status === client_1.UserStatusEnum.PENDING_VERIFICATION) {
            await this.prisma.verificationToken.deleteMany({ where: { identifier: dto.email } });
            const tokenString = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await this.prisma.verificationToken.create({
                data: {
                    identifier: dto.email,
                    token: tokenString,
                    expiresAt,
                },
            });
            await this.emailService.sendVerificationEmail(user.email, tokenString);
        }
        return {
            success: true,
            message: 'If your account is pending verification, a new email has been sent.',
        };
    }
    async validateGoogleOAuth(profile, ip, userAgent) {
        this.logger.debug(`Processing Google OAuth for email: ${profile.email}`);
        const oauthAccount = await this.prisma.oAuthAccount.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: 'google',
                    providerAccountId: profile.providerAccountId,
                },
            },
            include: {
                user: {
                    include: {
                        role: { include: { permissions: true } },
                        clientProfile: {
                            include: {
                                subscriptions: {
                                    where: { status: { in: ['ACTIVE', 'TRIALING'] } }
                                },
                                orders: {
                                    where: { status: { in: ['CONFIRMED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED'] } }
                                }
                            }
                        }
                    }
                }
            },
        });
        let user;
        if (oauthAccount) {
            user = oauthAccount.user;
            await this.prisma.oAuthAccount.update({
                where: { id: oauthAccount.id },
                data: {
                    accessToken: profile.accessToken,
                    refreshToken: profile.refreshToken,
                },
            });
        }
        else {
            user = await this.prisma.user.findUnique({
                where: { email: profile.email },
                include: {
                    role: { include: { permissions: true } },
                    clientProfile: {
                        include: {
                            subscriptions: {
                                where: { status: { in: ['ACTIVE', 'TRIALING'] } }
                            },
                            orders: {
                                where: { status: { in: ['CONFIRMED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED'] } }
                            }
                        }
                    }
                },
            });
            if (!user) {
                const clientRole = await this.prisma.role.findUnique({ where: { slug: 'CLIENT' } });
                user = await this.prisma.user.create({
                    data: {
                        email: profile.email,
                        firstName: profile.firstName || 'Google',
                        lastName: profile.lastName || 'User',
                        avatarUrl: profile.avatarUrl,
                        status: client_1.UserStatusEnum.ACTIVE,
                        roleId: clientRole.id,
                    },
                    include: {
                        role: { include: { permissions: true } },
                        clientProfile: {
                            include: {
                                subscriptions: {
                                    where: { status: { in: ['ACTIVE', 'TRIALING'] } }
                                },
                                orders: {
                                    where: { status: { in: ['CONFIRMED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED'] } }
                                }
                            }
                        }
                    },
                });
            }
            await this.prisma.oAuthAccount.create({
                data: {
                    provider: 'google',
                    providerAccountId: profile.providerAccountId,
                    userId: user.id,
                    accessToken: profile.accessToken,
                    refreshToken: profile.refreshToken,
                },
            });
        }
        if (user.status === client_1.UserStatusEnum.SUSPENDED || user.status === client_1.UserStatusEnum.INACTIVE) {
            throw new custom_exceptions_1.CustomForbiddenException('Your account is currently disabled or suspended.');
        }
        const permissionSlugs = user.role.permissions ? user.role.permissions.map((p) => p.slug) : [];
        const tokens = await this.generateTokens(user.id, user.email, user.role.slug, permissionSlugs, user.organizationId || undefined);
        const refreshTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: refreshTokenHash,
                expiresAt: refreshExpiresAt,
                ipAddress: ip,
                userAgent,
            },
        });
        const sessionToken = crypto.randomBytes(24).toString('hex');
        await this.sessionsService.createSession(user.id, sessionToken, refreshExpiresAt, ip, userAgent);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            sessionToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl,
                status: user.status,
                role: user.role.slug,
                permissions: permissionSlugs,
                hasActivePlan: !!(user.clientProfile?.subscriptions?.length || user.clientProfile?.orders?.length),
            },
        };
    }
    async generateTokens(userId, email, role, permissions, organizationId) {
        const payload = {
            sub: userId,
            email,
            role,
            permissions,
            organizationId,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.jwtSecret,
                expiresIn: this.jwtExpiresIn,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.jwtRefreshSecret,
                expiresIn: this.jwtRefreshExpiresIn,
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService,
        audit_service_1.AuditService,
        sessions_service_1.SessionsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
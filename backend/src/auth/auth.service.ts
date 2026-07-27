import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { EmailService } from '../shared/email/email.service';
import { AuditService } from '../shared/audit/audit.service';
import { SessionsService } from '../sessions/sessions.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserStatusEnum } from '@prisma/client';
import {
  CustomConflictException,
  CustomUnauthorizedException,
  CustomForbiddenException,
  BusinessException,
} from '../common/exceptions/custom.exceptions';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto, ResendVerificationDto } from './dto/verify-email.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService extends BaseService {
  private readonly bcryptRounds: number;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtRefreshExpiresIn: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly auditService: AuditService,
    private readonly sessionsService: SessionsService,
  ) {
    super(AuthService.name);
    this.bcryptRounds = this.configService.get<number>('auth.bcryptRounds', 12);
    this.jwtSecret = this.configService.get<string>('auth.jwtSecret', 'default-secret-change-me');
    this.jwtExpiresIn = this.configService.get<string>('auth.jwtExpiresIn', '15m');
    this.jwtRefreshSecret = this.configService.get<string>('auth.jwtRefreshSecret', 'default-refresh-secret-change-me');
    this.jwtRefreshExpiresIn = this.configService.get<string>('auth.jwtRefreshExpiresIn', '7d');
  }

  async register(dto: RegisterDto, ip?: string, userAgent?: string) {
    this.logger.debug(`Registering user with email: ${dto.email}`);
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new CustomConflictException('A user with this email address already exists');
    }

    const clientRole = await this.prisma.role.findUnique({ where: { slug: 'CLIENT' } });
    if (!clientRole) {
      throw new BusinessException('Default CLIENT role is not initialized in system. Please run database seeding.');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        status: UserStatusEnum.PENDING_VERIFICATION,
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

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
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
      throw new CustomUnauthorizedException('Invalid email or password');
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
      throw new CustomUnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatusEnum.SUSPENDED || user.status === UserStatusEnum.INACTIVE) {
      throw new CustomForbiddenException(
        `Your account is currently ${user.status.toLowerCase()}. Please contact support.`,
      );
    }

    const permissionSlugs = user.role.permissions ? user.role.permissions.map((p) => p.slug) : [];
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role.slug,
      permissionSlugs,
      user.organizationId || undefined,
    );

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

  async refreshToken(dto: RefreshTokenDto, ip?: string, userAgent?: string) {
    this.logger.debug('Refreshing access token');
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.jwtRefreshSecret,
      });
    } catch (error) {
      throw new CustomUnauthorizedException('Invalid or expired refresh token');
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
      throw new CustomUnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: { include: { permissions: true } } },
    });

    if (!user || user.status === UserStatusEnum.SUSPENDED || user.status === UserStatusEnum.INACTIVE) {
      throw new CustomForbiddenException('User account is suspended or inactive');
    }

    // Rotate token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const permissionSlugs = user.role.permissions ? user.role.permissions.map((p) => p.slug) : [];
    const newTokens = await this.generateTokens(
      user.id,
      user.email,
      user.role.slug,
      permissionSlugs,
      user.organizationId || undefined,
    );

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

  async logout(userId: string, refreshToken?: string, sessionToken?: string) {
    this.logger.debug(`Logging out user ${userId}`);
    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else {
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

  async forgotPassword(dto: ForgotPasswordDto, ip?: string, userAgent?: string) {
    this.logger.debug(`Password reset requested for: ${dto.email}`);
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (user && user.status !== UserStatusEnum.SUSPENDED) {
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

  async resetPassword(dto: ResetPasswordDto, ip?: string, userAgent?: string) {
    this.logger.debug('Resetting password via token');
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new BusinessException('This password reset token is invalid or has expired.');
    }

    const user = await this.prisma.user.findUnique({ where: { email: resetToken.email } });
    if (!user) {
      throw new BusinessException('User associated with this reset token no longer exists.');
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

  async verifyEmail(dto: VerifyEmailDto, ip?: string, userAgent?: string) {
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
      throw new BusinessException('Verification link is invalid or has expired.');
    }

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new BusinessException('User account no longer exists.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { status: UserStatusEnum.ACTIVE },
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

  async resendVerificationEmail(dto: ResendVerificationDto, ip?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (user && user.status === UserStatusEnum.PENDING_VERIFICATION) {
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

  async validateGoogleOAuth(profile: any, ip?: string, userAgent?: string) {
    this.logger.debug(`Processing Google OAuth for email: ${profile.email}`);
    const oauthAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: profile.providerAccountId,
        },
      },
      include: { user: { include: { role: { include: { permissions: true } } } } },
    });

    let user: any;
    if (oauthAccount) {
      user = oauthAccount.user;
      await this.prisma.oAuthAccount.update({
        where: { id: oauthAccount.id },
        data: {
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
        },
      });
    } else {
      user = await this.prisma.user.findUnique({
        where: { email: profile.email },
        include: { role: { include: { permissions: true } } },
      });

      if (!user) {
        const clientRole = await this.prisma.role.findUnique({ where: { slug: 'CLIENT' } });
        user = await this.prisma.user.create({
          data: {
            email: profile.email,
            firstName: profile.firstName || 'Google',
            lastName: profile.lastName || 'User',
            avatarUrl: profile.avatarUrl,
            status: UserStatusEnum.ACTIVE,
            roleId: clientRole!.id,
          },
          include: { role: { include: { permissions: true } } },
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

    if (user.status === UserStatusEnum.SUSPENDED || user.status === UserStatusEnum.INACTIVE) {
      throw new CustomForbiddenException('Your account is currently disabled or suspended.');
    }

    const permissionSlugs = user.role.permissions ? user.role.permissions.map((p: any) => p.slug) : [];
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role.slug,
      permissionSlugs,
      user.organizationId || undefined,
    );

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
      },
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    permissions: string[],
    organizationId?: string,
  ) {
    const payload: JwtPayload = {
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
      } as any),
      this.jwtService.signAsync(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtRefreshExpiresIn,
      } as any),
    ]);

    return { accessToken, refreshToken };
  }
}

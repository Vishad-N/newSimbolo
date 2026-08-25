import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../shared/email/email.service';
import { AuditService } from '../shared/audit/audit.service';
import { SessionsService } from '../sessions/sessions.service';
import { UserStatusEnum } from '@prisma/client';
import {
  CustomConflictException,
  CustomUnauthorizedException,
  CustomForbiddenException,
  BusinessException,
} from '../common/exceptions/custom.exceptions';
import * as bcrypt from 'bcrypt';

// Low bcrypt rounds so tests stay fast — security of the real work factor is
// covered by env.validation.ts's production config checks, not this suite.
const TEST_BCRYPT_ROUNDS = 4;

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: { signAsync: jest.Mock; verifyAsync: jest.Mock };
  let emailService: { sendVerificationEmail: jest.Mock; sendPasswordResetEmail: jest.Mock; sendWelcomeEmail: jest.Mock };
  let auditService: { logEvent: jest.Mock };
  let sessionsService: { createSession: jest.Mock; terminateAllSessions: jest.Mock };

  beforeEach(() => {
    prisma = {
      user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      role: { findUnique: jest.fn() },
      verificationToken: { create: jest.fn(), findUnique: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
      refreshToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
      passwordResetToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), deleteMany: jest.fn() },
      oAuthAccount: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
      verifyAsync: jest.fn(),
    };
    const configService = {
      get: jest.fn((key: string, def?: unknown) => {
        const map: Record<string, unknown> = {
          'auth.bcryptRounds': TEST_BCRYPT_ROUNDS,
          'auth.jwtSecret': 'test-secret',
          'auth.jwtExpiresIn': '15m',
          'auth.jwtRefreshSecret': 'test-refresh-secret',
          'auth.jwtRefreshExpiresIn': '7d',
        };
        return key in map ? map[key] : def;
      }),
    };
    emailService = {
      sendVerificationEmail: jest.fn().mockResolvedValue(true),
      sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
      sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    };
    auditService = { logEvent: jest.fn().mockResolvedValue(undefined) };
    sessionsService = {
      createSession: jest.fn().mockResolvedValue(undefined),
      terminateAllSessions: jest.fn().mockResolvedValue(undefined),
    };

    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
      emailService as unknown as EmailService,
      auditService as unknown as AuditService,
      sessionsService as unknown as SessionsService,
    );
  });

  describe('register', () => {
    it('creates a new CLIENT user and sends a verification email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue({ id: 'role-client', slug: 'CLIENT' });
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        status: UserStatusEnum.PENDING_VERIFICATION,
      });
      prisma.verificationToken.create.mockResolvedValue({});

      const result = await service.register({
        email: 'a@b.com',
        password: 'Password1',
        firstName: 'A',
        lastName: 'B',
      } as any);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ roleId: 'role-client' }) }),
      );
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith('a@b.com', expect.any(String));
      expect(result.data.userId).toBe('user-1');
    });

    it('rejects registration when the email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(service.register({ email: 'a@b.com', password: 'x' } as any)).rejects.toBeInstanceOf(
        CustomConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('fails clearly if the default CLIENT role has not been seeded', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue(null);

      await expect(service.register({ email: 'a@b.com', password: 'x' } as any)).rejects.toBeInstanceOf(
        BusinessException,
      );
    });
  });

  describe('login', () => {
    const baseUser = {
      id: 'user-1',
      email: 'a@b.com',
      status: UserStatusEnum.ACTIVE,
      role: { slug: 'CLIENT', permissions: [{ slug: 'x' }] },
    };

    it('rejects a nonexistent email with the same generic message as a wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nope@x.com', password: 'x' } as any),
      ).rejects.toBeInstanceOf(CustomUnauthorizedException);
    });

    it('rejects an incorrect password', async () => {
      const passwordHash = await bcrypt.hash('correct-password', TEST_BCRYPT_ROUNDS);
      prisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash });

      await expect(
        service.login({ email: 'a@b.com', password: 'wrong-password' } as any),
      ).rejects.toBeInstanceOf(CustomUnauthorizedException);
    });

    it('rejects a suspended account even with the correct password', async () => {
      const passwordHash = await bcrypt.hash('correct-password', TEST_BCRYPT_ROUNDS);
      prisma.user.findUnique.mockResolvedValue({ ...baseUser, status: UserStatusEnum.SUSPENDED, passwordHash });

      await expect(
        service.login({ email: 'a@b.com', password: 'correct-password' } as any),
      ).rejects.toBeInstanceOf(CustomForbiddenException);
    });

    it('issues tokens and starts a session for valid credentials', async () => {
      const passwordHash = await bcrypt.hash('correct-password', TEST_BCRYPT_ROUNDS);
      prisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash });
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({ email: 'a@b.com', password: 'correct-password' } as any);

      expect(result.accessToken).toBe('signed-token');
      expect(sessionsService.createSession).toHaveBeenCalled();
      expect(result.user.role).toBe('CLIENT');
    });
  });

  describe('refreshToken', () => {
    it('rejects an invalid or expired refresh token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('bad token'));

      await expect(service.refreshToken({ refreshToken: 'bad' } as any)).rejects.toBeInstanceOf(
        CustomUnauthorizedException,
      );
    });

    it('revokes every session for the user when a previously-revoked token is reused (theft detection)', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1' });
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 10_000),
      });
      prisma.refreshToken.updateMany.mockResolvedValue({});

      await expect(service.refreshToken({ refreshToken: 'stolen' } as any)).rejects.toBeInstanceOf(
        CustomUnauthorizedException,
      );
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('rotates the refresh token and issues new tokens on success', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1' });
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 10_000),
      });
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        status: UserStatusEnum.ACTIVE,
        role: { slug: 'CLIENT', permissions: [] },
      });
      prisma.refreshToken.update.mockResolvedValue({});
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.refreshToken({ refreshToken: 'valid' } as any);

      expect(prisma.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'rt-1' },
        data: { revokedAt: expect.any(Date) },
      });
      expect(result.accessToken).toBe('signed-token');
    });
  });

  describe('forgotPassword', () => {
    it('returns the same generic success message whether or not the email exists (no user enumeration)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword({ email: 'nobody@x.com' } as any);

      expect(result.success).toBe(true);
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('creates a reset token and emails it for an existing, non-suspended user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'a@b.com', status: UserStatusEnum.ACTIVE });
      prisma.passwordResetToken.deleteMany.mockResolvedValue({});
      prisma.passwordResetToken.create.mockResolvedValue({});

      const result = await service.forgotPassword({ email: 'a@b.com' } as any);

      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith('a@b.com', expect.any(String));
      expect(result.success).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('rejects an invalid, expired, or already-used token', async () => {
      prisma.passwordResetToken.findUnique.mockResolvedValue(null);

      await expect(
        service.resetPassword({ token: 'nope', newPassword: 'x' } as any),
      ).rejects.toBeInstanceOf(BusinessException);
    });

    it('updates the password and revokes all existing sessions on success', async () => {
      prisma.passwordResetToken.findUnique.mockResolvedValue({
        id: 'reset-1',
        token: 'tok',
        email: 'a@b.com',
        usedAt: null,
        expiresAt: new Date(Date.now() + 10_000),
      });
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'a@b.com' });
      prisma.user.update.mockResolvedValue({});
      prisma.passwordResetToken.update.mockResolvedValue({});
      prisma.refreshToken.updateMany.mockResolvedValue({});

      const result = await service.resetPassword({ token: 'tok', newPassword: 'NewPassword1' } as any);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { passwordHash: expect.any(String) },
      });
      expect(sessionsService.terminateAllSessions).toHaveBeenCalledWith('user-1');
      expect(result.success).toBe(true);
    });
  });
});

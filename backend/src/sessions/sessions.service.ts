import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CustomForbiddenException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class SessionsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super(SessionsService.name);
  }

  async createSession(userId: string, sessionToken: string, expiresAt: Date, ipAddress?: string, userAgent?: string) {
    this.logger.debug(`Creating new session for user ${userId}`);
    return this.prisma.session.create({
      data: {
        userId,
        sessionToken,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });
  }

  async findByToken(sessionToken: string) {
    return this.prisma.session.findUnique({
      where: { sessionToken },
    });
  }

  async getUserSessions(userId: string) {
    this.logger.debug(`Retrieving active sessions for user ${userId}`);
    const now = new Date();
    return this.prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: now },
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
      },
    });
  }

  async touchSession(sessionToken: string) {
    try {
      await this.prisma.session.update({
        where: { sessionToken },
        data: { updatedAt: new Date() },
      });
    } catch (error) {
      // Ignore if session was removed or expired
    }
  }

  async terminateSession(userId: string, sessionId: string) {
    this.logger.debug(`Terminating session ${sessionId} for user ${userId}`);
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return { success: true, message: 'Session already terminated or not found' };
    }

    if (session.userId !== userId) {
      throw new CustomForbiddenException('You do not have permission to terminate this session');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    return { success: true, message: 'Session terminated successfully' };
  }

  async terminateAllSessions(userId: string, currentSessionToken?: string) {
    this.logger.debug(`Terminating all sessions for user ${userId} (except current: ${!!currentSessionToken})`);

    const whereClause: any = { userId };
    if (currentSessionToken) {
      whereClause.sessionToken = { not: currentSessionToken };
    }

    const result = await this.prisma.session.deleteMany({
      where: whereClause,
    });

    return {
      success: true,
      count: result.count,
      message: `Terminated ${result.count} active session(s)`,
    };
  }

  async cleanupExpiredSessions() {
    const now = new Date();
    const result = await this.prisma.session.deleteMany({
      where: { expiresAt: { lte: now } },
    });
    if (result.count > 0) {
      this.logger.log(`🧹 Purged ${result.count} expired sessions`);
    }
    return result.count;
  }
}

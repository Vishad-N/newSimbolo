import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { QueueService } from '../queues/queue.service';
import { SentryService } from '../observability/sentry.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly queueService: QueueService,
    private readonly sentryService: SentryService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Check real-time application and database health' })
  @ApiResponse({
    status: 200,
    description: 'System health diagnostics payload',
    schema: {
      example: {
        status: 'ok',
        uptime: 124.5,
        timestamp: '2026-07-25T12:00:00.000Z',
        database: { status: 'up' },
      },
    },
  })
  async checkHealth() {
    const database = await this.checkDatabase();
    const redis = await this.cacheService.ping();
    const queues = await this.queueService.getHealth();

    return {
      status: database === 'up' ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: { status: database },
      redis: { status: redis },
      queues,
      observability: { sentry: this.sentryService.status() },
    };
  }

  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Container liveness probe' })
  live() {
    return { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Container readiness probe with dependency checks' })
  async ready() {
    const [database, redis, queues] = await Promise.all([
      this.checkDatabase(),
      this.cacheService.ping(),
      this.queueService.getHealth(),
    ]);
    const requiredOk = database === 'up' && redis !== 'down' && queues.status !== 'down';
    return {
      status: requiredOk ? 'ready' : 'not_ready',
      database: { status: database },
      redis: { status: redis },
      queues,
      storage: {
        provider: this.configService.get<string>('storage.provider'),
        status: this.configService.get<string>('storage.bucket') ? 'configured' : 'missing_config',
      },
      email: {
        status: this.configService.get<string>('email.host') ? 'configured' : 'mock_or_missing_config',
      },
      paymentGateway: {
        razorpay: this.configService.get<string>('razorpay.keyId') ? 'configured' : 'mock_or_missing_config',
      },
      aiProvider: { status: 'mock' },
    };
  }

  private async checkDatabase(): Promise<'up' | 'unreachable'> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'up';
    } catch {
      return 'unreachable';
    }
  }
}

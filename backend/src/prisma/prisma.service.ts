import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

/**
 * Appends `connection_limit` (and a matching `pool_timeout`) to DATABASE_URL if
 * not already present. Without this, Prisma's query engine falls back to its own
 * default pool-sizing formula based on perceived CPU count, which is how a small
 * container ends up opening ~100 connections against Supabase's pooler — most of
 * which just sit idle and eat into the pooler's connection ceiling instead of
 * speeding anything up.
 */
function withConnectionLimit(url: string, poolSize: number): string {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('connection_limit')) {
      parsed.searchParams.set('connection_limit', String(poolSize));
    }
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '10');
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const url = configService.get<string>('database.url', '');
    const poolSize = configService.get<number>('database.poolSize', 20);
    super({
      datasources: url ? { db: { url: withConnectionLimit(url, poolSize) } } : undefined,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Prisma Client will connect lazily on first database operation.');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting Prisma Client...');
    await this.$disconnect();
    this.logger.log('Prisma Client disconnected gracefully.');
  }
}

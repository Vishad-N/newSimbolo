import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Prisma Client connection pool...');
    try {
      await this.$connect();
      this.logger.log('Prisma Client connected successfully.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown database connection error';
      this.logger.error(`Database connection failed during bootstrap: ${message}`);
      this.logger.warn('Verify DATABASE_URL is set and URL encoded correctly.');
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting Prisma Client...');
    await this.$disconnect();
    this.logger.log('Prisma Client disconnected gracefully.');
  }
}

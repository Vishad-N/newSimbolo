import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
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
    } catch (error: any) {
      this.logger.error(`Database connection failed during bootstrap: ${error.message}`);
      this.logger.warn(
        '⚠️ Hostinger deployment note: Please verify DATABASE_URL is set in Hostinger Environment Variables. Ensure special characters in database password are URL encoded.',
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting Prisma Client...');
    await this.$disconnect();
    this.logger.log('Prisma Client disconnected gracefully.');
  }
}

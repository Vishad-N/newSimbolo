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
        '⚠️ Please check your DATABASE_URL in `backend/.env` and verify your PostgreSQL username and password. If using Docker, ensure containers are running with `docker-compose up -d`.',
      );
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

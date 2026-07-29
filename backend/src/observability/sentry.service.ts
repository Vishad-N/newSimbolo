import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryService implements OnModuleInit {
  private initialized = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const dsn = this.configService.get<string>('observability.sentryDsn');
    if (!dsn) return;
    Sentry.init({
      dsn,
      environment: this.configService.get<string>('observability.sentryEnvironment'),
      release: this.configService.get<string>('observability.release'),
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    });
    this.initialized = true;
  }

  captureException(error: unknown) {
    if (this.initialized) Sentry.captureException(error);
  }

  status() {
    return this.initialized ? 'configured' : 'disabled';
  }
}

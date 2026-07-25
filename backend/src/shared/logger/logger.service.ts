import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const isProd = process.env.NODE_ENV === 'production';

    const logFormat = isProd
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        )
      : winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.colorize({ all: true }),
          winston.format.printf(({ timestamp, level, message, context, stack }) => {
            const ctx = context ? `[${context}] ` : '';
            const stackTrace = stack ? `\n${stack}` : '';
            return `${timestamp} ${level}: ${ctx}${message}${stackTrace}`;
          }),
        );

    this.logger = winston.createLogger({
      level: isProd ? 'info' : 'debug',
      format: logFormat,
      transports: [new winston.transports.Console()],
    });
  }

  log(message: any, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, { context });
  }
}

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_CODES } from '../constants/error-codes.constant';
import { SentryService } from '../../observability/sentry.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly sentryService: SentryService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
    let details: any = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = exceptionResponse.message || exception.message;
        errorCode = exceptionResponse.errorCode || this.mapStatusToErrorCode(statusCode);
        details = exceptionResponse.error || undefined;
      }
    } else if (this.isPrismaError(exception)) {
      const prismaErr = exception as any;
      if (prismaErr.code === 'P2002') {
        statusCode = HttpStatus.CONFLICT;
        errorCode = ERROR_CODES.CONFLICT;
        const target = prismaErr.meta?.target || 'field';
        message = `Unique constraint violation on ${Array.isArray(target) ? target.join(', ') : target}`;
      } else if (prismaErr.code === 'P2025') {
        statusCode = HttpStatus.NOT_FOUND;
        errorCode = ERROR_CODES.NOT_FOUND;
        message = 'Requested record was not found in the database';
      } else if (prismaErr.code === 'P2003') {
        statusCode = HttpStatus.BAD_REQUEST;
        errorCode = ERROR_CODES.VALIDATION_ERROR;
        message = 'Foreign key constraint violation on related record';
      } else {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        errorCode = ERROR_CODES.DATABASE_ERROR;
        message = `A database operation failed: ${prismaErr.code} - ${prismaErr.message}`;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    // Log the exception
    if (statusCode >= 500) {
      this.sentryService.captureException(exception);
      this.logger.error(
        `[${request.method}] ${request.url} - Status: ${statusCode} - Message: ${message}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`[${request.method}] ${request.url} - Status: ${statusCode} - Message: ${message}`);
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message: Array.isArray(message) ? message[0] : message,
      errorCode,
      details: Array.isArray(message) ? message : details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private isPrismaError(exception: any): boolean {
    return (
      exception && typeof exception === 'object' && typeof exception.code === 'string' && exception.code.startsWith('P')
    );
  }

  private mapStatusToErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ERROR_CODES.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ERROR_CODES.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ERROR_CODES.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ERROR_CODES.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ERROR_CODES.CONFLICT;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ERROR_CODES.RATE_LIMIT_EXCEEDED;
      default:
        return ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }
}

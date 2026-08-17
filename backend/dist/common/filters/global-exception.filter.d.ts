import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { SentryService } from '../../observability/sentry.service';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly sentryService;
    private readonly logger;
    constructor(sentryService: SentryService);
    catch(exception: unknown, host: ArgumentsHost): void;
    private isPrismaError;
    private mapStatusToErrorCode;
}

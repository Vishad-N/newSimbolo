"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const error_codes_constant_1 = require("../constants/error-codes.constant");
const sentry_service_1 = require("../../observability/sentry.service");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    sentryService;
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    constructor(sentryService) {
        this.sentryService = sentryService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorCode = error_codes_constant_1.ERROR_CODES.INTERNAL_SERVER_ERROR;
        let details = undefined;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = exceptionResponse.message || exception.message;
                errorCode = exceptionResponse.errorCode || this.mapStatusToErrorCode(statusCode);
                details = exceptionResponse.error || undefined;
            }
        }
        else if (this.isPrismaError(exception)) {
            const prismaErr = exception;
            if (prismaErr.code === 'P2002') {
                statusCode = common_1.HttpStatus.CONFLICT;
                errorCode = error_codes_constant_1.ERROR_CODES.CONFLICT;
                const target = prismaErr.meta?.target || 'field';
                message = `Unique constraint violation on ${Array.isArray(target) ? target.join(', ') : target}`;
            }
            else if (prismaErr.code === 'P2025') {
                statusCode = common_1.HttpStatus.NOT_FOUND;
                errorCode = error_codes_constant_1.ERROR_CODES.NOT_FOUND;
                message = 'Requested record was not found in the database';
            }
            else if (prismaErr.code === 'P2003') {
                statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorCode = error_codes_constant_1.ERROR_CODES.VALIDATION_ERROR;
                message = 'Foreign key constraint violation on related record';
            }
            else {
                statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                errorCode = error_codes_constant_1.ERROR_CODES.DATABASE_ERROR;
                message = `A database operation failed: ${prismaErr.code} - ${prismaErr.message}`;
            }
        }
        else if (exception instanceof Error) {
            message = exception.message || message;
        }
        // Log the exception
        if (statusCode >= 500) {
            this.sentryService.captureException(exception);
            this.logger.error(`[${request.method}] ${request.url} - Status: ${statusCode} - Message: ${message}`, exception instanceof Error ? exception.stack : '');
        }
        else {
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
    isPrismaError(exception) {
        return (exception && typeof exception === 'object' && typeof exception.code === 'string' && exception.code.startsWith('P'));
    }
    mapStatusToErrorCode(status) {
        switch (status) {
            case common_1.HttpStatus.BAD_REQUEST:
                return error_codes_constant_1.ERROR_CODES.VALIDATION_ERROR;
            case common_1.HttpStatus.UNAUTHORIZED:
                return error_codes_constant_1.ERROR_CODES.UNAUTHORIZED;
            case common_1.HttpStatus.FORBIDDEN:
                return error_codes_constant_1.ERROR_CODES.FORBIDDEN;
            case common_1.HttpStatus.NOT_FOUND:
                return error_codes_constant_1.ERROR_CODES.NOT_FOUND;
            case common_1.HttpStatus.CONFLICT:
                return error_codes_constant_1.ERROR_CODES.CONFLICT;
            case common_1.HttpStatus.TOO_MANY_REQUESTS:
                return error_codes_constant_1.ERROR_CODES.RATE_LIMIT_EXCEEDED;
            default:
                return error_codes_constant_1.ERROR_CODES.INTERNAL_SERVER_ERROR;
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [sentry_service_1.SentryService])
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map
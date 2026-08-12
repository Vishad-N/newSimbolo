import { HttpException, HttpStatus } from '@nestjs/common';
export declare class BusinessException extends HttpException {
    constructor(message: string, errorCode?: string, status?: HttpStatus);
}
export declare class ResourceNotFoundException extends HttpException {
    constructor(resourceName: string, identifier?: string);
}
export declare class CustomUnauthorizedException extends HttpException {
    constructor(message?: string);
}
export declare class CustomForbiddenException extends HttpException {
    constructor(message?: string);
}
export declare class CustomConflictException extends HttpException {
    constructor(message: string);
}

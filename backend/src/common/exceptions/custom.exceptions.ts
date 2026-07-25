import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error-codes.constant';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    errorCode: string = ERROR_CODES.VALIDATION_ERROR,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ success: false, message, errorCode, statusCode: status }, status);
  }
}

export class ResourceNotFoundException extends HttpException {
  constructor(resourceName: string, identifier?: string) {
    const msg = identifier
      ? `${resourceName} with identifier "${identifier}" was not found`
      : `${resourceName} was not found`;
    super(
      { success: false, message: msg, errorCode: ERROR_CODES.NOT_FOUND, statusCode: HttpStatus.NOT_FOUND },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class CustomUnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized access') {
    super(
      { success: false, message, errorCode: ERROR_CODES.UNAUTHORIZED, statusCode: HttpStatus.UNAUTHORIZED },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class CustomForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden: You do not have sufficient permissions to access this resource') {
    super(
      { success: false, message, errorCode: ERROR_CODES.FORBIDDEN, statusCode: HttpStatus.FORBIDDEN },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class CustomConflictException extends HttpException {
  constructor(message: string) {
    super(
      { success: false, message, errorCode: ERROR_CODES.CONFLICT, statusCode: HttpStatus.CONFLICT },
      HttpStatus.CONFLICT,
    );
  }
}

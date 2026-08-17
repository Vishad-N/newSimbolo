"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomConflictException = exports.CustomForbiddenException = exports.CustomUnauthorizedException = exports.ResourceNotFoundException = exports.BusinessException = void 0;
const common_1 = require("@nestjs/common");
const error_codes_constant_1 = require("../constants/error-codes.constant");
class BusinessException extends common_1.HttpException {
    constructor(message, errorCode = error_codes_constant_1.ERROR_CODES.VALIDATION_ERROR, status = common_1.HttpStatus.BAD_REQUEST) {
        super({ success: false, message, errorCode, statusCode: status }, status);
    }
}
exports.BusinessException = BusinessException;
class ResourceNotFoundException extends common_1.HttpException {
    constructor(resourceName, identifier) {
        const msg = identifier
            ? `${resourceName} with identifier "${identifier}" was not found`
            : `${resourceName} was not found`;
        super({ success: false, message: msg, errorCode: error_codes_constant_1.ERROR_CODES.NOT_FOUND, statusCode: common_1.HttpStatus.NOT_FOUND }, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.ResourceNotFoundException = ResourceNotFoundException;
class CustomUnauthorizedException extends common_1.HttpException {
    constructor(message = 'Unauthorized access') {
        super({ success: false, message, errorCode: error_codes_constant_1.ERROR_CODES.UNAUTHORIZED, statusCode: common_1.HttpStatus.UNAUTHORIZED }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.CustomUnauthorizedException = CustomUnauthorizedException;
class CustomForbiddenException extends common_1.HttpException {
    constructor(message = 'Forbidden: You do not have sufficient permissions to access this resource') {
        super({ success: false, message, errorCode: error_codes_constant_1.ERROR_CODES.FORBIDDEN, statusCode: common_1.HttpStatus.FORBIDDEN }, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.CustomForbiddenException = CustomForbiddenException;
class CustomConflictException extends common_1.HttpException {
    constructor(message) {
        super({ success: false, message, errorCode: error_codes_constant_1.ERROR_CODES.CONFLICT, statusCode: common_1.HttpStatus.CONFLICT }, common_1.HttpStatus.CONFLICT);
    }
}
exports.CustomConflictException = CustomConflictException;
//# sourceMappingURL=custom.exceptions.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseUtil = void 0;
class ApiResponseUtil {
    static success(data, message = 'Operation successful', meta) {
        return {
            success: true,
            message,
            data,
            ...(meta && { meta }),
        };
    }
    static error(message, statusCode, errorCode) {
        return {
            success: false,
            message,
            ...(statusCode && { statusCode }),
            ...(errorCode && { errorCode }),
            timestamp: new Date().toISOString(),
        };
    }
}
exports.ApiResponseUtil = ApiResponseUtil;
//# sourceMappingURL=api-response.util.js.map
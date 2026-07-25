import { ApiResponseDto } from '../dto/api-response.dto';

export class ApiResponseUtil {
  static success<T>(data: T, message: string = 'Operation successful', meta?: Record<string, any>): ApiResponseDto<T> {
    return {
      success: true,
      message,
      data,
      ...(meta && { meta }),
    };
  }

  static error(message: string, statusCode?: number, errorCode?: string): Record<string, any> {
    return {
      success: false,
      message,
      ...(statusCode && { statusCode }),
      ...(errorCode && { errorCode }),
      timestamp: new Date().toISOString(),
    };
  }
}

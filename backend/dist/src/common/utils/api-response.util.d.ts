import { ApiResponseDto } from '../dto/api-response.dto';
export declare class ApiResponseUtil {
    static success<T>(data: T, message?: string, meta?: Record<string, any>): ApiResponseDto<T>;
    static error(message: string, statusCode?: number, errorCode?: string): Record<string, any>;
}

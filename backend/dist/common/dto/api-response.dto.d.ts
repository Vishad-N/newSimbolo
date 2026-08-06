export declare class ApiResponseDto<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: Record<string, any>;
}

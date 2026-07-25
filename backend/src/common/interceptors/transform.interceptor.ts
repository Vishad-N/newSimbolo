import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already wrapped in standard envelope (e.g. paginated or manual wrapper), return as is or normalize
        if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
          return data as ApiResponseDto<T>;
        }

        return {
          success: true,
          message: 'Operation successful',
          data: data !== undefined ? data : null,
        } as ApiResponseDto<T>;
      }),
    );
  }
}

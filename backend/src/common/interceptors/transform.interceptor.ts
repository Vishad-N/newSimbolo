import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prisma } from '@prisma/client';
import { ApiResponseDto } from '../dto/api-response.dto';

// Prisma.Decimal serializes to a string via toJSON(); convert it back to a
// plain number here so every API response keeps the pre-Decimal-migration
// numeric contract for frontend consumers.
function convertDecimals(value: unknown): unknown {
  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }
  if (Array.isArray(value)) {
    return value.map(convertDecimals);
  }
  if (value instanceof Date) {
    return value;
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = convertDecimals(val);
    }
    return result;
  }
  return value;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        const converted = convertDecimals(data);

        // If data is already wrapped in standard envelope (e.g. paginated or manual wrapper), return as is or normalize
        if (converted && typeof converted === 'object' && 'success' in converted && 'message' in converted) {
          return converted as ApiResponseDto<T>;
        }

        return {
          success: true,
          message: 'Operation successful',
          data: converted !== undefined ? converted : null,
        } as ApiResponseDto<T>;
      }),
    );
  }
}

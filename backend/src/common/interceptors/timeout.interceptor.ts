import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ERROR_CODES } from '../constants/error-codes.constant';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutMs: number = 10000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException({
                success: false,
                message: `Request exceeded SLA timeout of ${this.timeoutMs}ms`,
                errorCode: ERROR_CODES.TIMEOUT_ERROR,
              }),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from '../../observability/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = process.hrtime.bigint();

    return next.handle().pipe(
      tap({
        next: () => this.record(request.method, request.route?.path ?? request.url, response.statusCode, start),
        error: () => this.record(request.method, request.route?.path ?? request.url, response.statusCode || 500, start),
      }),
    );
  }

  private record(method: string, route: string, statusCode: number, start: bigint) {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1_000_000_000;
    this.metricsService.recordHttpRequest(method, route, statusCode, durationSeconds);
  }
}

export declare class MetricsService {
    private readonly registry;
    private readonly httpRequests;
    private readonly httpDuration;
    private readonly websocketConnections;
    constructor();
    recordHttpRequest(method: string, route: string, statusCode: number, durationSeconds: number): void;
    setWebsocketConnections(count: number): void;
    renderPrometheusMetrics(): Promise<string>;
    contentType(): "text/plain; version=0.0.4; charset=utf-8";
}

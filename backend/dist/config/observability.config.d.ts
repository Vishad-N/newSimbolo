declare const _default: (() => {
    sentryDsn: string;
    sentryEnvironment: string;
    release: string;
    metricsEnabled: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    sentryDsn: string;
    sentryEnvironment: string;
    release: string;
    metricsEnabled: boolean;
}>;
export default _default;

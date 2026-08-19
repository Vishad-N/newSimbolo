/**
 * RazorpayX (payouts) configuration.
 * All values are optional — when credentials are absent the gateway falls back to
 * MOCK mode (mirrors the RazorpayGateway `isMockMode` convention).
 */
declare const _default: (() => {
    keyId: string;
    keySecret: string;
    accountNumber: string;
    webhookSecret: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    keyId: string;
    keySecret: string;
    accountNumber: string;
    webhookSecret: string;
}>;
export default _default;

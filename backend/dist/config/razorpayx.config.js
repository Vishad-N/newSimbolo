"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * RazorpayX (payouts) configuration.
 * All values are optional — when credentials are absent the gateway falls back to
 * MOCK mode (mirrors the RazorpayGateway `isMockMode` convention).
 */
exports.default = (0, config_1.registerAs)('razorpayx', () => ({
    keyId: process.env.RAZORPAYX_KEY_ID || 'mock-razorpayx-key-id',
    keySecret: process.env.RAZORPAYX_KEY_SECRET || 'mock-razorpayx-key-secret',
    accountNumber: process.env.RAZORPAYX_ACCOUNT_NUMBER || 'mock-razorpayx-account-number',
    webhookSecret: process.env.RAZORPAYX_WEBHOOK_SECRET || 'mock-razorpayx-webhook-secret',
}));
//# sourceMappingURL=razorpayx.config.js.map
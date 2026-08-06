"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('razorpay', () => ({
    keyId: process.env.RAZORPAY_KEY_ID || 'mock-razorpay-key-id',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'mock-razorpay-key-secret',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'mock-razorpay-webhook-secret',
}));
//# sourceMappingURL=razorpay.config.js.map
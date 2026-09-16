import { registerAs } from '@nestjs/config';

/**
 * RazorpayX (payouts) configuration. Requires real credentials —
 * RazorpayXGateway throws at startup if any of these are missing.
 */
export default registerAs('razorpayx', () => ({
  keyId: process.env.RAZORPAYX_KEY_ID || '',
  keySecret: process.env.RAZORPAYX_KEY_SECRET || '',
  accountNumber: process.env.RAZORPAYX_ACCOUNT_NUMBER || '',
  webhookSecret: process.env.RAZORPAYX_WEBHOOK_SECRET || '',
}));

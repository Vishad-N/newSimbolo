import { registerAs } from '@nestjs/config';

export default registerAs('razorpay', () => ({
  keyId: process.env.RAZORPAY_KEY_ID || 'mock-razorpay-key-id',
  keySecret: process.env.RAZORPAY_KEY_SECRET || 'mock-razorpay-key-secret',
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'mock-razorpay-webhook-secret',
}));

import { Request } from 'express';
import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    /**
     * Razorpay webhook endpoint.
     * Public (no JWT) — authentication via HMAC-SHA256 signature validation.
     * Requires raw body for signature verification.
     */
    handleRazorpayWebhook(signature: string, req: Request): Promise<{
        processed: boolean;
        event: string;
    }>;
}

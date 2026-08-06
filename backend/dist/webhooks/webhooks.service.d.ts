import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayGateway } from '../payments/razorpay.provider';
export declare class WebhooksService {
    private readonly prisma;
    private readonly razorpayGateway;
    private readonly configService;
    private readonly logger;
    private readonly webhookSecret;
    constructor(prisma: PrismaService, razorpayGateway: RazorpayGateway, configService: ConfigService);
    handleRazorpayWebhook(rawBody: Buffer, signature: string): Promise<{
        processed: boolean;
        event: string;
    }>;
    private handlePaymentCaptured;
    private handlePaymentFailed;
    private handleRefundProcessed;
    private handleSubscriptionCharged;
    private handleSubscriptionCancelled;
}

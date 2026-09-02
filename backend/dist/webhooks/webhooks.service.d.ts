import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayGateway } from '../payments/razorpay.provider';
import { CommissionService } from '../affiliate/services/commission.service';
import { PaymentsService } from '../payments/payments.service';
export declare class WebhooksService {
    private readonly prisma;
    private readonly razorpayGateway;
    private readonly configService;
    private readonly commissionService;
    private readonly paymentsService;
    private readonly logger;
    private readonly webhookSecret;
    constructor(prisma: PrismaService, razorpayGateway: RazorpayGateway, configService: ConfigService, commissionService: CommissionService, paymentsService: PaymentsService);
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

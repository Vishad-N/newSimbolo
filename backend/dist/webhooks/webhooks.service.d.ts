import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayGateway } from '../payments/razorpay.provider';
import { InvoicesService } from '../invoices/invoices.service';
import { CommissionService } from '../affiliate/services/commission.service';
export declare class WebhooksService {
    private readonly prisma;
    private readonly razorpayGateway;
    private readonly configService;
    private readonly invoicesService;
    private readonly commissionService;
    private readonly logger;
    private readonly webhookSecret;
    constructor(prisma: PrismaService, razorpayGateway: RazorpayGateway, configService: ConfigService, invoicesService: InvoicesService, commissionService: CommissionService);
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

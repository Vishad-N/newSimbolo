import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../../shared/abstractions/base.service';
import { WalletService } from '../services/wallet.service';
import { RazorpayXGateway } from '../services/razorpayx.provider';
import { WithdrawalService } from '../services/withdrawal.service';
/**
 * Inbound RazorpayX payout webhook.
 *
 * Public (no JWT) — authenticated by HMAC-SHA256 over the RAW request body, which
 * requires RawBodyMiddleware to be applied to this route in AppModule.
 *
 * Idempotency: every event is claimed by inserting into WebhookEvent (eventId is
 * @unique). A P2002 on that insert means the event was already received, so we
 * acknowledge with 200 and do no further processing. Razorpay retries aggressively,
 * so this guard is what stops a double-debit.
 */
export declare class RazorpayXWebhookController extends BaseService {
    private readonly prisma;
    private readonly razorpayx;
    private readonly withdrawalService;
    private readonly walletService;
    constructor(prisma: PrismaService, razorpayx: RazorpayXGateway, withdrawalService: WithdrawalService, walletService: WalletService);
    handle(signature: string, req: Request): Promise<{
        processed: boolean;
        duplicate: boolean;
        event: string;
    } | {
        processed: boolean;
        event: string;
        duplicate?: undefined;
    }>;
    private route;
}

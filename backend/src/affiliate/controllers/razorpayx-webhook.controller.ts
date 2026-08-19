import { BadRequestException, Controller, Headers, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
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
@ApiTags('Webhooks')
@Controller('webhooks')
export class RazorpayXWebhookController extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayx: RazorpayXGateway,
    private readonly withdrawalService: WithdrawalService,
    private readonly walletService: WalletService,
  ) {
    super('RazorpayXWebhookController');
  }

  @Post('razorpayx')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'RazorpayX inbound payout webhook',
    description: 'Handles payout.processed / payout.failed / payout.reversed. Signature-verified and idempotent.',
  })
  @ApiResponse({ status: 200, description: 'Webhook accepted' })
  @ApiResponse({ status: 400, description: 'Invalid signature or payload' })
  async handle(@Headers('x-razorpay-signature') signature: string, @Req() req: Request) {
    const rawBody: Buffer = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body));

    if (!this.razorpayx.verifyWebhookSignature(rawBody, signature ?? '')) {
      this.logger.warn('🚨 Invalid RazorpayX webhook signature received');
      throw new BadRequestException('Invalid webhook signature');
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      throw new BadRequestException('Invalid webhook JSON payload');
    }

    const eventType: string = payload?.event ?? 'unknown';
    const payoutEntity = payload?.payload?.payout?.entity;
    // Razorpay sends `x-razorpay-event-id`; fall back to a deterministic key so the
    // uniqueness guard still works if the header is absent.
    const eventId: string =
      (req.headers['x-razorpay-event-id'] as string) ??
      `${eventType}:${payoutEntity?.id ?? 'unknown'}:${payload?.created_at ?? ''}`;

    // Claim the event — this INSERT is the idempotency boundary.
    try {
      await this.prisma.webhookEvent.create({
        data: { provider: 'RAZORPAYX', eventId, eventType, payload },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        this.logger.log(`🔄 Idempotent skip: RazorpayX event ${eventId} already processed`);
        return { processed: false, duplicate: true, event: eventType };
      }
      throw error;
    }

    let processingError: string | undefined;
    try {
      await this.route(eventType, payoutEntity);
    } catch (error) {
      processingError = (error as Error).message;
      this.logger.error(`RazorpayX webhook ${eventType} processing failed: ${processingError}`);
    }

    await this.prisma.webhookEvent.update({
      where: { eventId },
      data: { processed: !processingError, processedAt: new Date(), error: processingError ?? null },
    });

    return { processed: !processingError, event: eventType };
  }

  private async route(eventType: string, entity: any): Promise<void> {
    if (!entity?.id) {
      this.logger.warn(`RazorpayX webhook ${eventType} carried no payout entity — ignoring`);
      return;
    }

    const withdrawal = await this.withdrawalService.findByRazorpayPayoutId(entity.id);
    if (!withdrawal) {
      this.logger.warn(`RazorpayX webhook ${eventType}: no withdrawal for payout ${entity.id}`);
      return;
    }

    switch (eventType) {
      case 'payout.processed':
        await this.withdrawalService.markPaidFromWebhook(
          withdrawal.id,
          entity.id,
          withdrawal.affiliate.userId,
          withdrawal.amount,
        );
        break;

      case 'payout.failed':
      case 'payout.rejected':
        await this.withdrawalService.markFailedFromWebhook(
          withdrawal.id,
          entity.failure_reason ?? entity.status_details?.description ?? 'Payout failed at RazorpayX',
          withdrawal.affiliate.userId,
          withdrawal.amount,
        );
        break;

      case 'payout.reversed':
        await this.walletService.reverseWithdrawalPayout(
          withdrawal.id,
          entity.failure_reason ?? 'Payout reversed by RazorpayX',
        );
        break;

      default:
        this.logger.log(`RazorpayX webhook event ${eventType} not handled — recorded and ignored`);
    }
  }
}

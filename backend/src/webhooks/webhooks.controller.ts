import { Controller, Post, Headers, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  /**
   * Razorpay webhook endpoint.
   * Public (no JWT) — authentication via HMAC-SHA256 signature validation.
   * Requires raw body for signature verification.
   */
  @Post('razorpay')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Razorpay inbound webhook',
    description:
      'Receives payment/subscription events from Razorpay. Validates HMAC-SHA256 signature using the webhook secret. Processes events idempotently.',
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid signature or payload' })
  handleRazorpayWebhook(@Headers('x-razorpay-signature') signature: string, @Req() req: Request) {
    if (!(req as any).rawBody) {
      console.warn(
        '⚠️ req.rawBody is undefined! Falling back to JSON.stringify(req.body). This will likely fail signature validation.',
      );
    }
    const rawBody: Buffer = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body));
    return this.webhooksService.handleRazorpayWebhook(rawBody, signature ?? '');
  }
}

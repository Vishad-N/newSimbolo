import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RazorpayGateway } from './razorpay.provider';
import { PrismaModule } from '../prisma/prisma.module';
import { AffiliateModule } from '../affiliate/affiliate.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { InvoicesModule } from '../invoices/invoices.module';

// Dependency direction is one-way: Webhooks -> Payments -> Affiliate.
// AffiliateModule never imports PaymentsModule, so no forwardRef is needed.
@Module({
  imports: [PrismaModule, AffiliateModule, NotificationsModule, InvoicesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayGateway],
  exports: [PaymentsService, RazorpayGateway],
})
export class PaymentsModule {}

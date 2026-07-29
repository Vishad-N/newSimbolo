import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/constants/role.constant';
import { PaymentStatusEnum } from '@prisma/client';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({
    summary: 'Create Razorpay gateway order',
    description:
      'Initiates a payment order on Razorpay for a given internal order. Returns the gateway order ID needed for the client-side checkout.',
  })
  @ApiResponse({ status: 201, description: 'Gateway order created successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  createOrder(@Body() dto: CreatePaymentOrderDto, @Request() req: any) {
    return this.paymentsService.createPaymentOrder(dto, req.user?.sub);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify Razorpay payment signature',
    description:
      'Validates the HMAC-SHA256 signature from Razorpay on the server side. Never trusts client-side payment status.',
  })
  @ApiResponse({ status: 200, description: 'Payment verified successfully' })
  @ApiResponse({ status: 403, description: 'Invalid payment signature' })
  verifyPayment(@Body() dto: VerifyPaymentDto, @Request() req: any) {
    return this.paymentsService.verifyPayment(dto, req.user?.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all payments (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatusEnum })
  @ApiQuery({ name: 'clientId', required: false, type: String })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: PaymentStatusEnum,
    @Query('clientId') clientId?: string,
  ) {
    return this.paymentsService.findAll(clientId, status, page, limit);
  }

  @Get('my')
  @ApiOperation({ summary: "Get current client's own payment history" })
  findMyPayments(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.paymentsService.findMyPayments(req.user?.sub, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment detail by ID' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(id);
  }
}

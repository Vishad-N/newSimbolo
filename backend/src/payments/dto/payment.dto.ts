import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsEnum } from 'class-validator';

export class CreatePaymentOrderDto {
  @ApiProperty({ description: 'Internal order ID to create gateway order for', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR', example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  /**
   * Optional sales-employee attribution code. It is re-validated server-side here —
   * a prior /checkout/affiliate/validate call is never trusted, and no "already
   * validated" flag from the client is accepted. An invalid code aborts the request
   * before any gateway call is made.
   */
  @ApiPropertyOptional({ description: 'Sales employee code applied at checkout', example: 'EMP-7K2QX' })
  @IsOptional()
  @IsString()
  employeeCode?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ description: 'Razorpay order ID from gateway', example: 'order_ABC123' })
  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @ApiProperty({ description: 'Razorpay payment ID from gateway', example: 'pay_XYZ789' })
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @ApiProperty({ description: 'HMAC-SHA256 signature from Razorpay callback', example: 'abc123...' })
  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}

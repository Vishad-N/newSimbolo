import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { OrderStatusEnum } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Client profile UUID' })
  @IsUUID('4')
  @IsNotEmpty()
  clientId!: string;

  @ApiPropertyOptional({
    example: 'c0a80123-4567-89ab-cdef-0123456789ab',
    description: 'Package UUID (optional if service items specified)',
  })
  @IsOptional()
  @IsUUID('4')
  packageId?: string;

  @ApiPropertyOptional({ example: 'c0a80123-4567-89ab-cdef-0123456789ab', description: 'Service UUID' })
  @IsOptional()
  @IsUUID('4')
  serviceId?: string;

  @ApiProperty({ example: 50000, description: 'Total order amount before tax and discounts' })
  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @ApiPropertyOptional({ example: 9000, default: 0, description: 'Tax amount (18% GST etc.)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiPropertyOptional({ example: 5000, default: 0, description: 'Discount amount applied' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiProperty({ example: 54000, description: 'Net payable amount (totalAmount + taxAmount - discountAmount)' })
  @IsNumber()
  @Min(0)
  netAmount!: number;

  @ApiPropertyOptional({ example: 'INR', default: 'INR', description: 'Currency code' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    example: 'Priority onboarding requested. Deadline: 15th Aug.',
    description: 'Internal order notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING_PAYMENT,
    description: 'Initial order status',
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatusEnum } from '@prisma/client';

export class InvoiceItemDto {
  @ApiProperty({ description: 'Item name', example: 'SEO Retainer - Professional Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Item description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Quantity', example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 15000 })
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @ApiPropertyOptional({ description: 'SAC (Services Accounting Code) for this line item', example: '998314' })
  @IsOptional()
  @IsString()
  sacCode?: string;

  @ApiPropertyOptional({ description: "This line item's GST rate; falls back to the invoice-level taxPercentage, then 18", example: 18 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gstRate?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Client profile ID', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiPropertyOptional({ description: 'Order ID to associate the invoice with', example: 'uuid' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({ description: 'Subscription ID to associate the invoice with', example: 'uuid' })
  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @ApiProperty({ description: 'Invoice due date', example: '2026-02-28T00:00:00.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ description: 'Line items', type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiPropertyOptional({ description: 'Tax percentage', default: 18, example: 18 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxPercentage?: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR', example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Additional notes on the invoice' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateInvoiceStatusDto {
  @ApiProperty({ enum: InvoiceStatusEnum, description: 'New invoice status' })
  @IsEnum(InvoiceStatusEnum)
  status: InvoiceStatusEnum;
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Orders & Billing')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Permissions('orders.view', 'orders.manage')
  @ApiOperation({ summary: 'List all orders with optional filters and pagination' })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'status', enum: OrderStatusEnum, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated order list' })
  async findAll(
    @Query('clientId') clientId?: string,
    @Query('status') status?: OrderStatusEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.ordersService.findAll(clientId, status, page, limit);
  }

  @Get(':id')
  @Permissions('orders.view', 'orders.manage')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiResponse({ status: 200, description: 'Order returned' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @Permissions('orders.manage')
  @ApiOperation({ summary: 'Create a new order for a client' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@Body() dto: CreateOrderDto, @CurrentUser() user: JwtPayload) {
    return this.ordersService.create(dto, user?.sub);
  }

  @Patch(':id')
  @Permissions('orders.manage')
  @ApiOperation({ summary: 'Update order status or details (CONFIRMED status triggers auto-project creation)' })
  @ApiResponse({
    status: 200,
    description: 'Order updated. If status changed to CONFIRMED, a project is auto-created.',
  })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderDto, @CurrentUser() user: JwtPayload) {
    return this.ordersService.update(id, dto, user?.sub);
  }

  @Delete(':id')
  @Permissions('orders.manage')
  @ApiOperation({ summary: 'Cancel and soft-delete an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.ordersService.softDelete(id, user?.sub);
  }
}

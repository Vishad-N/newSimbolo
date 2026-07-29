import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/constants/role.constant';
import { SubscriptionStatusEnum } from '@prisma/client';

@ApiTags('Subscriptions')
@ApiBearerAuth('JWT-auth')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new subscription' })
  create(@Body() dto: CreateSubscriptionDto, @Request() req: any) {
    return this.subscriptionsService.create(dto, req.user?.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all subscriptions (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: SubscriptionStatusEnum })
  @ApiQuery({ name: 'clientId', required: false, type: String })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: SubscriptionStatusEnum,
    @Query('clientId') clientId?: string,
  ) {
    return this.subscriptionsService.findAll(clientId, status, page, limit);
  }

  @Get('my')
  @ApiOperation({ summary: "Get current client's subscriptions" })
  findMySubscriptions(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.subscriptionsService.findMySubscriptions(req.user?.sub, page, limit);
  }

  @Get('admin/renewal-reminders')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Trigger renewal reminders for expiring subscriptions (admin)' })
  sendRenewalReminders() {
    return this.subscriptionsService.sendRenewalReminders().then((count) => ({
      message: `Sent ${count} renewal reminders`,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription detail' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update subscription (upgrade/downgrade/status change)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSubscriptionDto, @Request() req: any) {
    return this.subscriptionsService.update(id, dto, req.user?.sub);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel subscription (at period end or immediately)' })
  @ApiQuery({ name: 'immediate', required: false, type: Boolean })
  cancel(@Param('id', ParseUUIDPipe) id: string, @Query('immediate') immediate: string, @Request() req: any) {
    return this.subscriptionsService.cancel(id, immediate === 'true', req.user?.sub);
  }

  @Patch(':id/pause')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Pause an active subscription' })
  pause(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.subscriptionsService.pause(id, req.user?.sub);
  }

  @Patch(':id/resume')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Resume a paused subscription' })
  resume(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.subscriptionsService.resume(id, req.user?.sub);
  }
}

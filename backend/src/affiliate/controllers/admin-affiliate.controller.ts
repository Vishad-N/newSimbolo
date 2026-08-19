import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AffiliateStatusEnum } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import {
  AdminAffiliateListQueryDto,
  AdminCommissionListQueryDto,
  AdminSalesListQueryDto,
  AdminWithdrawalListQueryDto,
  CreateAffiliateEmployeeDto,
} from '../dto/admin-list-query.dto';
import { WithdrawalActionDto } from '../dto/request-withdrawal.dto';
import { UpdateAffiliateSettingsDto } from '../dto/update-affiliate-settings.dto';
import { AffiliateSettingsService } from '../services/affiliate-settings.service';
import { AffiliateService } from '../services/affiliate.service';
import { CommissionSweepService } from '../services/commission-sweep.service';
import { WithdrawalService } from '../services/withdrawal.service';

@ApiTags('Admin — Affiliate')
@ApiBearerAuth('JWT-auth')
@Controller('admin/affiliate')
@Permissions('affiliate.manage')
export class AdminAffiliateController {
  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly withdrawalService: WithdrawalService,
    private readonly settingsService: AffiliateSettingsService,
    private readonly sweepService: CommissionSweepService,
  ) {}

  // ── Employees ─────────────────────────────────────────────────────────────

  @Get('employees')
  @ApiOperation({ summary: 'List sales employees' })
  listEmployees(@Query() query: AdminAffiliateListQueryDto) {
    return this.affiliateService.listEmployees(query);
  }

  @Get('employees/:id')
  @ApiOperation({ summary: 'Get a sales employee' })
  getEmployee(@Param('id', ParseUUIDPipe) id: string) {
    return this.affiliateService.getEmployee(id);
  }

  @Post('employees')
  @ApiOperation({
    summary: 'Create a sales employee for an existing user',
    description: 'Generates a unique EMP-XXXXX code and provisions the wallet in one transaction.',
  })
  createEmployee(@Body() dto: CreateAffiliateEmployeeDto, @CurrentUser() user: any) {
    return this.affiliateService.createEmployee(dto.userId, {
      commissionRate: dto.commissionRate,
      actorUserId: user?.sub,
    });
  }

  @Patch('employees/:id/activate')
  @ApiOperation({ summary: 'Activate a sales employee' })
  activate(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.affiliateService.setEmployeeStatus(id, AffiliateStatusEnum.ACTIVE, user?.sub);
  }

  @Patch('employees/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate a sales employee (stops new commission accrual)' })
  deactivate(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.affiliateService.setEmployeeStatus(id, AffiliateStatusEnum.INACTIVE, user?.sub);
  }

  @Delete('employees/:id')
  @ApiOperation({
    summary: 'Soft-delete a sales employee',
    description:
      'Refuses to delete while the wallet has an outstanding balance or a withdrawal is in flight — settle those first.',
  })
  deleteEmployee(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.affiliateService.deleteEmployee(id, user?.sub);
  }

  // ── Sales & commissions ───────────────────────────────────────────────────

  @Get('sales')
  @ApiOperation({ summary: 'List affiliate-attributed sales' })
  listSales(@Query() query: AdminSalesListQueryDto) {
    return this.affiliateService.listSales(query);
  }

  @Get('commissions')
  @ApiOperation({ summary: 'List commissions' })
  listCommissions(@Query() query: AdminCommissionListQueryDto) {
    return this.affiliateService.listCommissions(query);
  }

  // ── Withdrawals ───────────────────────────────────────────────────────────

  @Get('withdrawals')
  @ApiOperation({ summary: 'List withdrawal requests' })
  listWithdrawals(@Query() query: AdminWithdrawalListQueryDto) {
    return this.withdrawalService.list(query);
  }

  @Get('withdrawals/:id')
  @ApiOperation({ summary: 'Get a withdrawal request' })
  getWithdrawal(@Param('id', ParseUUIDPipe) id: string) {
    return this.withdrawalService.findOne(id);
  }

  @Post('withdrawals/:id/approve')
  @Permissions('affiliate.manage', 'affiliate.payouts.process')
  @ApiOperation({ summary: 'Approve a pending withdrawal (schedules it for payout)' })
  approve(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.withdrawalService.approve(id, user?.sub);
  }

  @Post('withdrawals/:id/process')
  @Permissions('affiliate.manage', 'affiliate.payouts.process')
  @ApiOperation({ summary: 'Initiate the RazorpayX payout for a withdrawal' })
  process(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.withdrawalService.process(id, user?.sub);
  }

  @Post('withdrawals/:id/retry')
  @Permissions('affiliate.manage', 'affiliate.payouts.process')
  @ApiOperation({ summary: 'Retry a failed withdrawal (re-reserves funds and re-initiates the payout)' })
  retry(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.withdrawalService.retry(id, user?.sub);
  }

  @Post('withdrawals/:id/cancel')
  @ApiOperation({ summary: 'Cancel a withdrawal and release the held funds' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @Body() dto: WithdrawalActionDto, @CurrentUser() user: any) {
    return this.withdrawalService.cancel(id, dto?.reason ?? 'Cancelled by admin', user?.sub);
  }

  // ── Settings & operations ─────────────────────────────────────────────────

  @Get('settings')
  @ApiOperation({ summary: 'Get affiliate program settings' })
  getSettings() {
    return this.settingsService.get();
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update affiliate program settings' })
  updateSettings(@Body() dto: UpdateAffiliateSettingsDto, @CurrentUser() user: any) {
    return this.settingsService.update(dto, user?.sub);
  }

  @Post('settings/run-sweep')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Manually run the commission eligibility / auto-payout sweep',
    description:
      'Runs the same idempotent job the BullMQ repeatable job runs. Exposed so the sweep is operable without Redis.',
  })
  runSweep() {
    return this.sweepService.run();
  }

  @Get('overview')
  @ApiOperation({ summary: 'Affiliate program dashboard stat cards' })
  overview() {
    return this.affiliateService.getOverview();
  }
}

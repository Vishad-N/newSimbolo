import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommissionStatusEnum, WithdrawalStatusEnum } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreatePayoutMethodDto, UpdatePayoutMethodDto } from '../dto/create-payout-method.dto';
import { RequestWithdrawalDto } from '../dto/request-withdrawal.dto';
import { AffiliateService } from '../services/affiliate.service';
import { PayoutMethodService } from '../services/payout-method.service';
import { WalletService } from '../services/wallet.service';
import { WithdrawalService } from '../services/withdrawal.service';

/**
 * Self-service surface for sales employees.
 *
 * SECURITY: every route resolves the caller's own Affiliate row from the JWT `sub`.
 * No route accepts an affiliateId/employeeId from the client, so one employee can
 * never read or act on another's wallet, commissions or payout methods.
 */
@ApiTags('Affiliate (Self)')
@ApiBearerAuth('JWT-auth')
@Controller('affiliate/me')
export class AffiliateMeController {
  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly walletService: WalletService,
    private readonly withdrawalService: WithdrawalService,
    private readonly payoutMethodService: PayoutMethodService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get my sales employee profile and headline stats' })
  getMe(@CurrentUser() user: any) {
    return this.affiliateService.getMyProfile(user.sub);
  }

  @Get('sales')
  @ApiOperation({ summary: 'List orders I have been attributed for' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMySales(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.affiliateService.getMySales(user.sub, page, limit);
  }

  @Get('commissions')
  @ApiOperation({ summary: 'List my commissions' })
  @ApiQuery({ name: 'status', required: false, enum: CommissionStatusEnum })
  getMyCommissions(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: CommissionStatusEnum,
  ) {
    return this.affiliateService.getMyCommissions(user.sub, page, limit, status);
  }

  @Get('wallet')
  @ApiOperation({ summary: 'Get my wallet balances' })
  async getMyWallet(@CurrentUser() user: any) {
    const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
    return this.walletService.getWalletByAffiliateId(affiliate.id);
  }

  @Get('wallet/transactions')
  @ApiOperation({ summary: 'Get my wallet ledger' })
  async getMyWalletTransactions(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
    const wallet = await this.walletService.getWalletByAffiliateId(affiliate.id);
    return this.walletService.listTransactions(wallet.id, page, limit);
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'List my withdrawal requests' })
  @ApiQuery({ name: 'status', required: false, enum: WithdrawalStatusEnum })
  async getMyWithdrawals(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: WithdrawalStatusEnum,
  ) {
    const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
    return this.withdrawalService.list({ affiliateId: affiliate.id, status, page, limit });
  }

  @Post('withdrawals')
  @ApiOperation({ summary: 'Request a withdrawal from my available wallet balance' })
  async requestWithdrawal(@CurrentUser() user: any, @Body() dto: RequestWithdrawalDto) {
    const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
    return this.withdrawalService.requestWithdrawal(affiliate.id, dto, user.sub);
  }

  @Get('payout-methods')
  @ApiOperation({ summary: 'List my payout methods (masked)' })
  async getMyPayoutMethods(@CurrentUser() user: any) {
    const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
    return this.payoutMethodService.list(affiliate.id);
  }

  @Post('payout-methods')
  @ApiOperation({
    summary: 'Add a payout method',
    description: 'Full account/UPI details are forwarded to RazorpayX and never persisted — only a mask is stored.',
  })
  async createPayoutMethod(@CurrentUser() user: any, @Body() dto: CreatePayoutMethodDto) {
    const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
    return this.payoutMethodService.create(affiliate.id, dto, user.sub);
  }

  @Put('payout-methods/:id')
  @ApiOperation({ summary: 'Update one of my payout methods' })
  async updatePayoutMethod(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePayoutMethodDto,
  ) {
    const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
    return this.payoutMethodService.update(affiliate.id, id, dto, user.sub);
  }

  @Delete('payout-methods/:id')
  @ApiOperation({ summary: 'Remove one of my payout methods' })
  async removePayoutMethod(@CurrentUser() user: any, @Param('id', ParseUUIDPipe) id: string) {
    const affiliate = await this.affiliateService.getMyAffiliateOrThrow(user.sub);
    return this.payoutMethodService.remove(affiliate.id, id, user.sub);
  }
}

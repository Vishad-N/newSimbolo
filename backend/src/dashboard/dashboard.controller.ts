import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/constants/role.constant';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Dashboard & Analytics')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Permissions('dashboard.view')
  @ApiOperation({ summary: 'Admin dashboard – agency-wide metrics, recent activity, project status breakdown' })
  @ApiResponse({ status: 200, description: 'Admin overview returned' })
  async getAdminOverview() {
    return this.dashboardService.getAdminOverview();
  }

  @Get('admin/revenue')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Admin revenue overview – current month vs last month, all-time total' })
  async getAdminRevenueOverview() {
    return this.dashboardService.getAdminRevenueOverview();
  }

  @Get('admin/payment-analytics')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Admin payment analytics – by status, provider, and daily revenue' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getAdminPaymentAnalytics(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.dashboardService.getAdminPaymentAnalytics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('admin/pending-invoices')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Admin pending invoices list' })
  async getAdminPendingInvoices(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.dashboardService.getAdminPendingInvoices(+page, +limit);
  }

  @Get('admin/widgets')
  @Permissions('dashboard.view')
  @ApiOperation({ summary: 'Admin configurable dashboard widget data for Phase 9 BI dashboard' })
  async getAdminWidgets() {
    return this.dashboardService.getAdminWidgets();
  }

  @Get('kpis')
  @Permissions('dashboard.view')
  @ApiOperation({ summary: 'Dashboard KPI summary including AOV, CLV, project completion, and revenue' })
  async getDashboardKpis() {
    return this.dashboardService.getDashboardKpis();
  }

  @Get('client/:clientId')
  @Permissions('dashboard.view', 'clients.read')
  @ApiOperation({ summary: 'Client dashboard – active projects, pending deliverables, meetings, tickets' })
  @ApiResponse({ status: 200, description: 'Client dashboard returned' })
  async getClientDashboard(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.dashboardService.getClientDashboard(clientId);
  }

  @Get('client/:clientId/billing')
  @ApiOperation({ summary: 'Client billing dashboard – payments, invoices, subscriptions, notifications' })
  async getClientBillingDashboard(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.dashboardService.getClientBillingDashboard(clientId);
  }

  @Get('client/:clientId/widgets')
  @Permissions('dashboard.view', 'clients.read')
  @ApiOperation({ summary: 'Client dashboard widget data for Phase 9 BI dashboard' })
  async getClientWidgets(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.dashboardService.getClientWidgets(clientId);
  }

  @Get('project/:projectId/stats')
  @Permissions('dashboard.view', 'projects.read')
  @ApiOperation({ summary: 'Project statistics – task breakdown, deliverable status, milestone progress' })
  @ApiResponse({ status: 200, description: 'Project stats returned' })
  async getProjectStats(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.dashboardService.getProjectStats(projectId);
  }
}

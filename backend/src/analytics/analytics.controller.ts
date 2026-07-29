import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Admin analytics dashboard with revenue, project, client, service, and workload metrics' })
  getAdminAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getAdminAnalytics(query);
  }

  @Get('client/:clientId')
  @Permissions('analytics.view', 'clients.read')
  @ApiOperation({ summary: 'Client analytics dashboard with project, billing, meeting, and activity insights' })
  getClientAnalytics(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.analyticsService.getClientAnalytics(clientId);
  }

  @Get('kpis')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Business KPI engine including growth, conversion, AOV, CLV, and utilization' })
  getKpis(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getKpis(query);
  }
}

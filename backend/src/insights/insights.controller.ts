import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { InsightQueryDto } from './dto/insight.dto';
import { InsightsService } from './insights.service';

@ApiTags('Insights')
@ApiBearerAuth('JWT-auth')
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post('generate')
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'Generate and store AI business insights from operational data' })
  generate() {
    return this.insightsService.generateInsights();
  }

  @Get()
  @Permissions('analytics.view')
  @ApiOperation({ summary: 'List stored business insights for dashboard display' })
  findAll(@Query() query: InsightQueryDto) {
    return this.insightsService.findInsights(query);
  }
}

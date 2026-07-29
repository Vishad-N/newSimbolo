import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { GenerateReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  @Permissions('reports.generate')
  @ApiOperation({ summary: 'Generate a dynamic business report with date range, grouping, sorting, and filters' })
  generate(@Body() dto: GenerateReportDto) {
    return this.reportsService.generate(dto);
  }
}

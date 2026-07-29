import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Permissions } from '../common/decorators/permissions.decorator';
import { ReportsService } from '../reports/reports.service';
import { ExportReportDto } from './dto/export.dto';
import { ExportsService } from './exports.service';

@ApiTags('Exports')
@ApiBearerAuth('JWT-auth')
@Controller('exports')
export class ExportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly exportsService: ExportsService,
  ) {}

  @Post('reports')
  @Permissions('reports.export')
  @ApiOperation({ summary: 'Export a generated report as PDF, CSV, or Excel-compatible spreadsheet' })
  async exportReport(@Body() dto: ExportReportDto, @Res() response: Response) {
    const report = await this.reportsService.generate(dto.report);
    const exportedFile = await this.exportsService.exportReport(report, dto.format);

    response.set({
      'Content-Type': exportedFile.mimeType,
      'Content-Disposition': `attachment; filename="${exportedFile.filename}"`,
      'Content-Length': exportedFile.buffer.length,
    });
    response.end(exportedFile.buffer);
  }
}

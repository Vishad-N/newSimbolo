import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GenerateReportDto } from '../../reports/dto/report.dto';

export enum ExportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  EXCEL = 'EXCEL',
}

export class ExportReportDto {
  @ApiProperty({ enum: ExportFormat })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiProperty({ type: GenerateReportDto })
  @ValidateNested()
  @Type(() => GenerateReportDto)
  report: GenerateReportDto;
}

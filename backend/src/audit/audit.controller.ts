import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { AuditQueryService } from './audit-query.service';
import { AuditQueryDto } from './dto/audit-query.dto';

@ApiTags('Audit')
@ApiBearerAuth('JWT-auth')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditQueryService: AuditQueryService) {}

  @Get('logs')
  @Permissions('audit.view')
  @ApiOperation({ summary: 'Search and filter audit/business logs' })
  findAll(@Query() query: AuditQueryDto) {
    return this.auditQueryService.findAll(query);
  }

  @Get('summary')
  @Permissions('audit.view')
  @ApiOperation({ summary: 'Audit log summary grouped by action and entity type' })
  summary(@Query() query: AuditQueryDto) {
    return this.auditQueryService.summary(query);
  }
}

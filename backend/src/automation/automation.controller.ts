import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { AutomationService } from './automation.service';
import { CreateAutomationRuleDto, ExecuteAutomationDto, UpdateAutomationRuleDto } from './dto/automation.dto';

@ApiTags('Automation')
@ApiBearerAuth('JWT-auth')
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post('rules')
  @Permissions('automation.manage')
  @ApiOperation({ summary: 'Create a configurable automation workflow rule' })
  create(@Body() dto: CreateAutomationRuleDto) {
    return this.automationService.create(dto);
  }

  @Get('rules')
  @Permissions('automation.manage')
  @ApiOperation({ summary: 'List automation workflow rules' })
  findAll() {
    return this.automationService.findAll();
  }

  @Patch('rules/:id')
  @Permissions('automation.manage')
  @ApiOperation({ summary: 'Update an automation workflow rule' })
  update(@Param('id') id: string, @Body() dto: UpdateAutomationRuleDto) {
    return this.automationService.update(id, dto);
  }

  @Delete('rules/:id')
  @Permissions('automation.manage')
  @ApiOperation({ summary: 'Delete an automation workflow rule' })
  remove(@Param('id') id: string) {
    return this.automationService.remove(id);
  }

  @Post('execute')
  @Permissions('automation.manage')
  @ApiOperation({ summary: 'Execute automation rules matching a workflow trigger' })
  execute(@Body() dto: ExecuteAutomationDto) {
    return this.automationService.execute(dto);
  }
}

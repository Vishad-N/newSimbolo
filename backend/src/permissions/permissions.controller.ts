import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Roles & Permissions Management')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('permissions.view')
  @ApiOperation({ summary: 'Get all system permissions' })
  @ApiResponse({ status: 200, description: 'List of all permissions returned successfully.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  async findAll() {
    return this.permissionsService.findAll();
  }

  @Get('module/:module')
  @Permissions('permissions.view')
  @ApiOperation({ summary: 'Get permissions filtered by module name' })
  @ApiResponse({ status: 200, description: 'Module permissions returned successfully.' })
  async findByModule(@Param('module') module: string) {
    return this.permissionsService.findByModule(module);
  }

  @Get(':id')
  @Permissions('permissions.view')
  @ApiOperation({ summary: 'Get permission details by UUID' })
  @ApiResponse({ status: 200, description: 'Permission returned successfully.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.findOne(id);
  }
}

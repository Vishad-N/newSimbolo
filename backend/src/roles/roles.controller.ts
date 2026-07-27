import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, AssignPermissionsDto } from './dto/update-role.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Roles & Permissions Management')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles.view')
  @ApiOperation({ summary: 'Get all security roles and their assigned permission bundles' })
  @ApiResponse({ status: 200, description: 'List of roles returned successfully.' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions.' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('roles.view')
  @ApiOperation({ summary: 'Get a specific role by UUID' })
  @ApiResponse({ status: 200, description: 'Role returned successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Permissions('roles.manage')
  @ApiOperation({ summary: 'Create a new custom role' })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiResponse({ status: 409, description: 'Role name or slug already exists.' })
  async create(@Body() dto: CreateRoleDto, @CurrentUser() user: JwtPayload) {
    return this.rolesService.create(dto, user.sub);
  }

  @Put(':id')
  @Permissions('roles.manage')
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto, @CurrentUser() user: JwtPayload) {
    return this.rolesService.update(id, dto, user.sub);
  }

  @Delete(':id')
  @Permissions('roles.manage')
  @ApiOperation({ summary: 'Delete a custom role' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Cannot delete role with active users assigned.' })
  @ApiResponse({ status: 403, description: 'System roles cannot be deleted.' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.rolesService.remove(id, user.sub);
  }

  @Post(':id/permissions')
  @Permissions('roles.manage', 'permissions.manage')
  @ApiOperation({ summary: 'Assign permission bundle to a role' })
  @ApiResponse({ status: 200, description: 'Permissions assigned successfully.' })
  async assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.rolesService.assignPermissions(id, dto, user.sub);
  }
}

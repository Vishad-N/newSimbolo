import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Projects & Workflow Management')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Permissions('projects.read', 'projects.manage')
  @ApiOperation({ summary: 'List all projects with optional filters and pagination' })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'status', enum: ProjectStatusEnum, required: false })
  @ApiQuery({ name: 'managerId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated project list' })
  async findAll(
    @Query('clientId') clientId?: string,
    @Query('status') status?: ProjectStatusEnum,
    @Query('managerId') managerId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.projectsService.findAll(clientId, status, managerId, page, limit);
  }

  @Get(':id')
  @Permissions('projects.read', 'projects.manage')
  @ApiOperation({ summary: 'Get project details with milestones, tasks, deliverables, and timeline' })
  @ApiResponse({ status: 200, description: 'Project detail returned' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Post(':id/recalculate-progress')
  @Permissions('projects.manage')
  @ApiOperation({ summary: 'Recalculate and update project completion percentage based on task statuses' })
  @ApiResponse({ status: 200, description: 'Progress recalculated and updated' })
  async recalculateProgress(@Param('id', ParseUUIDPipe) id: string) {
    const progress = await this.projectsService.recalculateProgress(id);
    return { progress, message: `Project progress updated to ${progress}%` };
  }

  @Post()
  @Permissions('projects.create', 'projects.manage')
  @ApiOperation({ summary: 'Create a new project manually (or auto-created when order confirmed)' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async create(@Body() dto: CreateProjectDto, @CurrentUser() user: JwtPayload) {
    return this.projectsService.create(dto, user?.sub);
  }

  @Patch(':id')
  @Permissions('projects.update', 'projects.manage')
  @ApiOperation({ summary: 'Update project details, status, priority, or manager' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProjectDto, @CurrentUser() user: JwtPayload) {
    return this.projectsService.update(id, dto, user?.sub);
  }

  @Delete(':id')
  @Permissions('projects.delete', 'projects.manage')
  @ApiOperation({ summary: 'Soft-delete (archive) a project' })
  @ApiResponse({ status: 200, description: 'Project archived' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.projectsService.softDelete(id, user?.sub);
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Project Milestones')
@ApiBearerAuth()
@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get('project/:projectId')
  @Permissions('projects.read', 'projects.manage')
  @ApiOperation({ summary: 'Get all milestones for a project ordered by sortOrder' })
  @ApiResponse({ status: 200, description: 'Project milestones returned' })
  async findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.milestonesService.findAll(projectId);
  }

  @Get(':id')
  @Permissions('projects.read', 'projects.manage')
  @ApiOperation({ summary: 'Get a single milestone with tasks and dependencies' })
  @ApiResponse({ status: 200, description: 'Milestone returned' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.milestonesService.findOne(id);
  }

  @Post()
  @Permissions('milestones.manage', 'projects.manage')
  @ApiOperation({ summary: 'Create a new project milestone' })
  @ApiResponse({ status: 201, description: 'Milestone created' })
  async create(@Body() dto: CreateMilestoneDto) {
    return this.milestonesService.create(dto);
  }

  @Patch(':id')
  @Permissions('milestones.manage', 'projects.manage')
  @ApiOperation({ summary: 'Update milestone status, dates, or order' })
  @ApiResponse({ status: 200, description: 'Milestone updated' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMilestoneDto) {
    return this.milestonesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('milestones.manage', 'projects.manage')
  @ApiOperation({ summary: 'Delete a milestone' })
  @ApiResponse({ status: 200, description: 'Milestone deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.milestonesService.remove(id);
  }
}

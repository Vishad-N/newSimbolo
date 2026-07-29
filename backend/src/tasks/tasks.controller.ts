import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, AddTaskCommentDto } from './dto/task.dto';
import { TaskStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Project Tasks & Kanban')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('project/:projectId')
  @Permissions('projects.read', 'projects.manage')
  @ApiOperation({ summary: 'Get all tasks for a project (Kanban board data)' })
  @ApiQuery({ name: 'status', enum: TaskStatusEnum, required: false })
  @ApiQuery({ name: 'assignedToId', required: false })
  @ApiResponse({ status: 200, description: 'Task list returned' })
  async findAll(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query('status') status?: TaskStatusEnum,
    @Query('assignedToId') assignedToId?: string,
  ) {
    return this.tasksService.findAll(projectId, status, assignedToId);
  }

  @Get(':id')
  @Permissions('projects.read', 'projects.manage')
  @ApiOperation({ summary: 'Get a single task with comments and attachments' })
  @ApiResponse({ status: 200, description: 'Task returned' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @Permissions('tasks.manage', 'projects.manage')
  @ApiOperation({ summary: 'Create a new task within a project' })
  @ApiResponse({ status: 201, description: 'Task created' })
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: JwtPayload) {
    return this.tasksService.create(dto, user?.sub);
  }

  @Patch(':id')
  @Permissions('tasks.manage', 'projects.manage')
  @ApiOperation({ summary: 'Update task status, assignee, priority, or hours' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: JwtPayload) {
    return this.tasksService.update(id, dto, user?.sub);
  }

  @Post(':id/comments')
  @Permissions('tasks.manage', 'projects.read')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiResponse({ status: 201, description: 'Comment added' })
  async addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddTaskCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasksService.addComment(id, dto, user?.sub);
  }

  @Delete(':id')
  @Permissions('tasks.manage', 'projects.manage')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}

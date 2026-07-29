import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DeliverablesService } from './deliverables.service';
import { CreateDeliverableDto, UpdateDeliverableDto } from './dto/deliverable.dto';
import { DeliverableStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Project Deliverables & Client Approvals')
@ApiBearerAuth()
@Controller('deliverables')
export class DeliverablesController {
  constructor(private readonly deliverablesService: DeliverablesService) {}

  @Get('project/:projectId')
  @Permissions('projects.read', 'deliverables.read')
  @ApiOperation({ summary: 'Get all deliverables for a project' })
  @ApiQuery({ name: 'status', enum: DeliverableStatusEnum, required: false })
  @ApiResponse({ status: 200, description: 'Deliverables returned' })
  async findAll(@Param('projectId', ParseUUIDPipe) projectId: string, @Query('status') status?: DeliverableStatusEnum) {
    return this.deliverablesService.findAll(projectId, status);
  }

  @Get(':id')
  @Permissions('projects.read', 'deliverables.read')
  @ApiOperation({ summary: 'Get a single deliverable with version history' })
  @ApiResponse({ status: 200, description: 'Deliverable returned' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliverablesService.findOne(id);
  }

  @Post()
  @Permissions('deliverables.upload', 'projects.manage')
  @ApiOperation({ summary: 'Create a new deliverable for a project' })
  @ApiResponse({ status: 201, description: 'Deliverable created' })
  async create(@Body() dto: CreateDeliverableDto, @CurrentUser() user: JwtPayload) {
    return this.deliverablesService.create(dto, user?.sub);
  }

  @Patch(':id')
  @Permissions('deliverables.upload', 'deliverables.approve', 'projects.manage')
  @ApiOperation({ summary: 'Update deliverable status, upload new version, or record client approval' })
  @ApiResponse({
    status: 200,
    description: 'Deliverable updated. Status APPROVED or SUBMITTED triggers timeline event.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeliverableDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.deliverablesService.update(id, dto, user?.sub);
  }

  @Delete(':id')
  @Permissions('projects.manage')
  @ApiOperation({ summary: 'Remove a deliverable' })
  @ApiResponse({ status: 200, description: 'Deliverable removed' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.deliverablesService.softDelete(id, user?.sub);
  }
}

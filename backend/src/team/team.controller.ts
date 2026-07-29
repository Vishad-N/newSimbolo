import { Controller, Get, Post, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { AssignTeamMemberDto } from './dto/assign-team-member.dto';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Project Team Management')
@ApiBearerAuth()
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('project/:projectId')
  @Permissions('projects.read', 'projects.manage')
  @ApiOperation({ summary: 'Get all team members assigned to a project' })
  @ApiResponse({ status: 200, description: 'Project team returned' })
  async getProjectTeam(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.teamService.getProjectTeam(projectId);
  }

  @Post('assign')
  @Permissions('team.assign', 'projects.manage')
  @ApiOperation({ summary: 'Assign an internal team member to a project with a role' })
  @ApiResponse({ status: 201, description: 'Team member assigned' })
  async assign(@Body() dto: AssignTeamMemberDto) {
    return this.teamService.assignMember(dto);
  }

  @Delete(':id')
  @Permissions('team.assign', 'projects.manage')
  @ApiOperation({ summary: 'Remove a team member from a project' })
  @ApiResponse({ status: 200, description: 'Team member removed' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.removeMember(id);
  }
}

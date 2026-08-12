import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { WebsiteTeamService } from './website-team.service';
import { CreateWebsiteTeamMemberDto } from './dto/create-website-team-member.dto';
import { UpdateWebsiteTeamMemberDto } from './dto/update-website-team-member.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Website Team')
@Controller('website-team')
export class WebsiteTeamController {
  constructor(private readonly websiteTeamService: WebsiteTeamService) {}

  @Post()
  @Permissions('content.create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new website team member' })
  @ApiResponse({ status: 201, description: 'The member has been successfully created.' })
  create(@Body() createDto: CreateWebsiteTeamMemberDto) {
    return this.websiteTeamService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all website team members' })
  findAll(@Query('activeOnly') activeOnly?: string) {
    return this.websiteTeamService.findAll(activeOnly === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific website team member by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.websiteTeamService.findOne(id);
  }

  @Patch('reorder')
  @Permissions('content.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder team members' })
  reorder(@Body() updates: { id: string; displayOrder: number }[]) {
    return this.websiteTeamService.reorder(updates);
  }

  @Patch(':id')
  @Permissions('content.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a website team member' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateWebsiteTeamMemberDto) {
    return this.websiteTeamService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('content.delete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a website team member' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.websiteTeamService.remove(id);
  }
}

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
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Meetings & Scheduling')
@ApiBearerAuth()
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  @Permissions('meetings.read', 'meetings.manage')
  @ApiOperation({ summary: 'List meetings with optional filters' })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'hostId', required: false })
  @ApiQuery({ name: 'upcoming', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated meetings list' })
  async findAll(
    @Query('clientId') clientId?: string,
    @Query('hostId') hostId?: string,
    @Query('upcoming', new DefaultValuePipe(false), ParseBoolPipe) upcoming = false,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.meetingsService.findAll(clientId, hostId, upcoming, page, limit);
  }

  @Get(':id')
  @Permissions('meetings.read', 'meetings.manage')
  @ApiOperation({ summary: 'Get meeting details with participants and agenda' })
  @ApiResponse({ status: 200, description: 'Meeting returned' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.meetingsService.findOne(id);
  }

  @Post()
  @Permissions('meetings.manage')
  @ApiOperation({ summary: 'Schedule a new meeting with participants' })
  @ApiResponse({ status: 201, description: 'Meeting scheduled' })
  async create(@Body() dto: CreateMeetingDto, @CurrentUser() user: JwtPayload) {
    return this.meetingsService.create(dto, user?.sub);
  }

  @Patch(':id')
  @Permissions('meetings.manage')
  @ApiOperation({ summary: 'Update meeting details, agenda, notes, or status' })
  @ApiResponse({ status: 200, description: 'Meeting updated' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMeetingDto, @CurrentUser() user: JwtPayload) {
    return this.meetingsService.update(id, dto, user?.sub);
  }

  @Delete(':id')
  @Permissions('meetings.manage')
  @ApiOperation({ summary: 'Cancel a meeting' })
  @ApiResponse({ status: 200, description: 'Meeting cancelled' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.meetingsService.softDelete(id, user?.sub);
  }
}

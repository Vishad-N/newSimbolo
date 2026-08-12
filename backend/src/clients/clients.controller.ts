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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientWithPlanDto } from './dto/create-client-with-plan.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Clients & Client Profiles')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Permissions('clients.read', 'clients.manage')
  @ApiOperation({ summary: 'List all client profiles with optional filters and pagination' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or email' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by client status' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'accountManagerId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of client profiles' })
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('companyId') companyId?: string,
    @Query('accountManagerId') accountManagerId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.clientsService.findAll(search, status, companyId, accountManagerId, page, limit);
  }

  @Get(':id')
  @Permissions('clients.read', 'clients.manage')
  @ApiOperation({ summary: 'Get a single client profile by ID with full detail' })
  @ApiResponse({ status: 200, description: 'Client profile returned' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Get('user/:userId')
  @Permissions('clients.read', 'clients.manage')
  @ApiOperation({ summary: 'Get client profile by User ID' })
  @ApiResponse({ status: 200, description: 'Client profile returned' })
  async findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.clientsService.findByUserId(userId);
  }

  @Get(':id/timeline')
  @Permissions('clients.read', 'clients.manage')
  @ApiOperation({ summary: 'Get chronological activity timeline for a client' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Activity timeline returned' })
  async getTimeline(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit = 30,
  ) {
    return this.clientsService.getClientTimeline(id, page, limit);
  }

  @Get(':id/dashboard')
  @Permissions('clients.read', 'clients.manage')
  @ApiOperation({ summary: 'Get admin dashboard summary for a specific client' })
  @ApiResponse({ status: 200, description: 'Client dashboard summary returned' })
  async getDashboard(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.getClientDashboard(id);
  }

  @Post()
  @Permissions('clients.manage')
  @ApiOperation({ summary: 'Create a new client profile' })
  @ApiResponse({ status: 201, description: 'Client profile created successfully' })
  @ApiResponse({ status: 409, description: 'Client profile already exists for this user' })
  async create(@Body() dto: CreateClientDto, @CurrentUser() user: JwtPayload) {
    return this.clientsService.create(dto, user?.sub);
  }

  @Post('manual')
  @Permissions('clients.manage')
  @ApiOperation({ summary: 'Create a client user, client profile, and optional plan subscription manually' })
  @ApiResponse({ status: 201, description: 'Client user created successfully' })
  async createManualClient(@Body() dto: CreateClientWithPlanDto, @CurrentUser() user: JwtPayload) {
    return this.clientsService.createWithUserAndPlan(dto, user?.sub);
  }

  @Patch(':id')
  @Permissions('clients.manage')
  @ApiOperation({ summary: 'Update an existing client profile' })
  @ApiResponse({ status: 200, description: 'Client profile updated successfully' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClientDto, @CurrentUser() user: JwtPayload) {
    return this.clientsService.update(id, dto, user?.sub);
  }

  @Delete(':id')
  @Permissions('clients.manage')
  @ApiOperation({ summary: 'Soft-delete (deactivate) a client profile' })
  @ApiResponse({ status: 200, description: 'Client profile deactivated' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.clientsService.softDelete(id, user?.sub);
  }
}

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
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import { DocumentCategoryEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Documents & Contracts')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @Permissions('documents.manage')
  @ApiOperation({ summary: 'List documents with optional filters (clientId, projectId, category) — staff only' })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'category', enum: DocumentCategoryEnum, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated document list' })
  async findAll(
    @Query('clientId') clientId?: string,
    @Query('projectId') projectId?: string,
    @Query('category') category?: DocumentCategoryEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.documentsService.findAll(clientId, projectId, category, page, limit);
  }

  @Get('my')
  @Permissions('documents.read')
  @ApiOperation({ summary: "Get current client's own documents" })
  @ApiQuery({ name: 'category', enum: DocumentCategoryEnum, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMyDocuments(
    @CurrentUser() user: JwtPayload,
    @Query('category') category?: DocumentCategoryEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.documentsService.findMyDocuments(user.sub, category, page, limit);
  }

  @Get(':id')
  @Permissions('documents.read')
  @ApiOperation({ summary: 'Get a single document by ID (own document for clients, any for staff)' })
  @ApiResponse({ status: 200, description: 'Document returned' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.documentsService.findOneForRequester(id, user);
  }

  @Post(':id/download')
  @Permissions('documents.read')
  @ApiOperation({ summary: 'Track a document download (increments download count)' })
  @ApiResponse({ status: 200, description: 'Download tracked' })
  async trackDownload(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    await this.documentsService.findOneForRequester(id, user);
    return this.documentsService.trackDownload(id);
  }

  @Post()
  @Permissions('documents.manage')
  @ApiOperation({ summary: 'Upload and register a new document' })
  @ApiResponse({ status: 201, description: 'Document created' })
  async create(@Body() dto: CreateDocumentDto, @CurrentUser() user: JwtPayload) {
    return this.documentsService.create(dto, user?.sub);
  }

  @Patch(':id')
  @Permissions('documents.manage')
  @ApiOperation({ summary: 'Update document metadata' })
  @ApiResponse({ status: 200, description: 'Document updated' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('documents.manage')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.softDelete(id);
  }
}

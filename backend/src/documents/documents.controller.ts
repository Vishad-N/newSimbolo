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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto, UploadDocumentDto } from './dto/document.dto';
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

  @Post('upload')
  @Permissions('documents.upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a real file and register it as a document (own client only for non-staff callers)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string', enum: Object.values(DocumentCategoryEnum) },
        clientId: { type: 'string', format: 'uuid', description: 'Staff only — ignored for client callers' },
        projectId: { type: 'string', format: 'uuid' },
      },
      required: ['file', 'title'],
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded and document created' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.uploadDocument(file, dto, user);
  }

  @Post()
  @Permissions('documents.manage')
  @ApiOperation({ summary: 'Register a document that is already hosted elsewhere (staff only, no file upload)' })
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

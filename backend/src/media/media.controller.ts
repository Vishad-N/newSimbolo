import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaFolderDto } from './dto/create-media-folder.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { MediaFilterDto } from './dto/media-filter.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Media Library & File Storage')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @Permissions('media.upload', 'content.create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a media asset (image, video, PDF, document)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'The media file to upload' },
        folderId: { type: 'string', format: 'uuid', description: 'Optional destination folder UUID' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
    @Query('folderId') folderId?: string,
  ) {
    return this.mediaService.uploadFile(file, user?.sub, folderId);
  }

  @Get()
  @Permissions('media.read', 'content.read')
  @ApiOperation({ summary: 'Get paginated list of media assets with optional filters' })
  @ApiResponse({ status: 200, description: 'Media asset list returned' })
  async getAssets(@Query() filter: MediaFilterDto) {
    return this.mediaService.getAssets(filter);
  }

  @Get('folders')
  @Permissions('media.read', 'content.read')
  @ApiOperation({ summary: 'Get media folder tree hierarchy' })
  @ApiResponse({ status: 200, description: 'Folders returned' })
  async getFolders(@Query('parentId') parentId?: string) {
    return this.mediaService.getFolders(parentId);
  }

  @Post('folders')
  @Permissions('media.manage', 'content.create')
  @ApiOperation({ summary: 'Create a new media folder' })
  @ApiResponse({ status: 201, description: 'Folder created successfully' })
  async createFolder(@Body() dto: CreateMediaFolderDto) {
    return this.mediaService.createFolder(dto);
  }

  @Delete('folders/:id')
  @Permissions('media.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete an empty media folder' })
  @ApiResponse({ status: 200, description: 'Folder deleted successfully' })
  async deleteFolder(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.deleteFolder(id);
  }

  @Get(':id')
  @Permissions('media.read', 'content.read')
  @ApiOperation({ summary: 'Get single media asset details by ID' })
  @ApiResponse({ status: 200, description: 'Asset details returned' })
  async getAssetById(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.getAssetById(id);
  }

  @Patch(':id')
  @Permissions('media.manage', 'content.update')
  @ApiOperation({ summary: 'Update media asset metadata (file name, destination folder)' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  async updateAsset(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMediaAssetDto) {
    return this.mediaService.updateAsset(id, dto);
  }

  @Delete(':id')
  @Permissions('media.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete a media asset from database and disk' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  async deleteAsset(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.deleteAsset(id);
  }
}

import {
  Controller,
  Get,
  Post,
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
import { WebsiteMediaService } from './website-media.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Website Media (Cloudinary)')
@ApiBearerAuth()
@Controller('website-media')
export class WebsiteMediaController {
  constructor(private readonly websiteMediaService: WebsiteMediaService) {}

  @Post('upload')
  @Permissions('media.upload', 'content.create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a website asset to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'The media file to upload' },
        folder: { type: 'string', description: 'Destination folder in Cloudinary (e.g. "blogs", "services")' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
    @Body('folder') folder?: string,
  ) {
    const targetFolder = folder || 'general';
    return this.websiteMediaService.uploadFile(file, targetFolder, user?.sub);
  }

  @Get()
  @Permissions('media.read', 'content.read')
  @ApiOperation({ summary: 'Get list of website media assets from database' })
  @ApiResponse({ status: 200, description: 'Media asset list returned' })
  async getAssets(@Query('folder') folder?: string) {
    return this.websiteMediaService.getAssets(folder);
  }

  @Get(':id')
  @Permissions('media.read', 'content.read')
  @ApiOperation({ summary: 'Get single website media asset details by ID' })
  @ApiResponse({ status: 200, description: 'Asset details returned' })
  async getAssetById(@Param('id', ParseUUIDPipe) id: string) {
    return this.websiteMediaService.getAssetById(id);
  }

  @Delete(':id')
  @Permissions('media.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete a website media asset from database and Cloudinary' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  async deleteAsset(@Param('id', ParseUUIDPipe) id: string) {
    return this.websiteMediaService.deleteAsset(id);
  }
}

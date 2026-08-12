import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetFolderDto, UploadRequestDto, RenameAssetDto, MoveAssetDto } from './dto/asset.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Client Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('folders/:clientId')
  @ApiOperation({ summary: 'Get all folders for a client' })
  getFolders(@Param('clientId') clientId: string) {
    return this.assetsService.getFolders(clientId);
  }

  @Post('folders/:clientId')
  @ApiOperation({ summary: 'Create a new folder' })
  createFolder(@Param('clientId') clientId: string, @Body() dto: CreateAssetFolderDto) {
    return this.assetsService.createFolder(clientId, dto);
  }

  @Patch('folders/:clientId/:folderId/rename')
  @ApiOperation({ summary: 'Rename a folder' })
  renameFolder(@Param('clientId') clientId: string, @Param('folderId') folderId: string, @Body() dto: RenameAssetDto) {
    return this.assetsService.renameFolder(folderId, clientId, dto);
  }

  @Delete('folders/:clientId/:folderId')
  @ApiOperation({ summary: 'Delete a folder' })
  deleteFolder(@Param('clientId') clientId: string, @Param('folderId') folderId: string) {
    return this.assetsService.deleteFolder(folderId, clientId);
  }

  @Get(':clientId')
  @ApiOperation({ summary: 'Get all assets for a client, optionally filtered by folder' })
  getAssets(@Param('clientId') clientId: string, @Query('folderId') folderId?: string) {
    // If folderId is 'root', we can pass null to the service or handle appropriately.
    const fid = folderId === 'root' ? null : folderId;
    return this.assetsService.getAssets(clientId, fid);
  }

  @Post(':clientId/upload-request')
  @ApiOperation({ summary: 'Request a presigned URL to upload a file' })
  createUploadRequest(@Param('clientId') clientId: string, @Body() dto: UploadRequestDto, @CurrentUser() user: any) {
    return this.assetsService.createUploadRequest(clientId, user.id, dto);
  }

  @Get(':clientId/:assetId/download')
  @ApiOperation({ summary: 'Get a presigned URL to download a file' })
  getDownloadUrl(@Param('clientId') clientId: string, @Param('assetId') assetId: string) {
    return this.assetsService.getSignedDownloadUrl(assetId, clientId);
  }

  @Patch(':clientId/:assetId/rename')
  @ApiOperation({ summary: 'Rename a file' })
  renameAsset(@Param('clientId') clientId: string, @Param('assetId') assetId: string, @Body() dto: RenameAssetDto) {
    return this.assetsService.renameAsset(assetId, clientId, dto);
  }

  @Patch(':clientId/:assetId/move')
  @ApiOperation({ summary: 'Move a file to another folder' })
  moveAsset(@Param('clientId') clientId: string, @Param('assetId') assetId: string, @Body() dto: MoveAssetDto) {
    return this.assetsService.moveAsset(assetId, clientId, dto);
  }

  @Delete(':clientId/:assetId')
  @ApiOperation({ summary: 'Soft delete a file' })
  deleteAsset(@Param('clientId') clientId: string, @Param('assetId') assetId: string) {
    return this.assetsService.deleteAsset(assetId, clientId);
  }

  @Get('storage-usage/:clientId')
  @ApiOperation({ summary: 'Get storage usage for a client' })
  getStorageUsage(@Param('clientId') clientId: string) {
    return this.assetsService.getStorageUsage(clientId);
  }
}

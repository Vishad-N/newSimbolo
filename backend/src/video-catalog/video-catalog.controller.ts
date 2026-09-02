import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VideoCatalogService } from './video-catalog.service';
import { CreateVideoCatalogItemDto } from './dto/create-video-catalog-item.dto';
import { UpdateVideoCatalogItemDto } from './dto/update-video-catalog-item.dto';
import { CreateVideoCatalogCategoryDto } from './dto/create-video-catalog-category.dto';
import { VideoCatalogStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Video Editing Service Catalog')
@Controller('video-catalog')
export class VideoCatalogController {
  constructor(private readonly videoCatalogService: VideoCatalogService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all video catalog categories (public)' })
  @ApiResponse({ status: 200, description: 'Categories returned' })
  async getCategories() {
    return this.videoCatalogService.getCategories();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get video catalog items (public defaults to PUBLISHED)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: VideoCatalogStatusEnum, required: false })
  @ApiResponse({ status: 200, description: 'Items returned' })
  async getItems(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('status') status?: VideoCatalogStatusEnum,
  ) {
    return this.videoCatalogService.getItems(categoryId, search, status);
  }

  @ApiBearerAuth()
  @Get('admin/all')
  @Permissions('video-catalog.manage', 'content.read')
  @ApiOperation({ summary: 'Get every video catalog item regardless of status (admin)' })
  @ApiResponse({ status: 200, description: 'Items returned' })
  async getAllItemsForAdmin() {
    return this.videoCatalogService.getItems(undefined, undefined, 'ALL');
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get single video catalog item by slug (public)' })
  @ApiResponse({ status: 200, description: 'Item returned' })
  async getItemBySlug(@Param('slug') slug: string) {
    return this.videoCatalogService.getItemBySlug(slug);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('video-catalog.manage', 'content.create')
  @ApiOperation({ summary: 'Create a new video editing service card' })
  @ApiResponse({ status: 201, description: 'Item created' })
  async createItem(@Body() dto: CreateVideoCatalogItemDto, @CurrentUser() user: JwtPayload) {
    return this.videoCatalogService.createItem(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch('reorder')
  @Permissions('video-catalog.manage', 'content.update')
  @ApiOperation({ summary: 'Reorder video catalog items by ID sequence' })
  @ApiResponse({ status: 200, description: 'Items reordered' })
  async reorderItems(@Body('orderedIds') orderedIds: string[]) {
    return this.videoCatalogService.reorderItems(orderedIds);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('video-catalog.manage', 'content.update')
  @ApiOperation({ summary: 'Update a video editing service card' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  async updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVideoCatalogItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.videoCatalogService.updateItem(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('video-catalog.manage', 'content.delete')
  @ApiOperation({ summary: 'Soft-delete a video editing service card' })
  @ApiResponse({ status: 200, description: 'Item deleted' })
  async deleteItem(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.videoCatalogService.deleteItem(id, user?.sub);
  }

  // Categories CRUD
  @ApiBearerAuth()
  @Post('categories')
  @Permissions('video-catalog.manage', 'content.create')
  @ApiOperation({ summary: 'Create a video catalog category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(@Body() dto: CreateVideoCatalogCategoryDto) {
    return this.videoCatalogService.createCategory(dto);
  }

  @ApiBearerAuth()
  @Delete('categories/:id')
  @Permissions('video-catalog.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete a video catalog category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.videoCatalogService.deleteCategory(id);
  }
}

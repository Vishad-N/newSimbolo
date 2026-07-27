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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogTagDto } from './dto/create-blog-tag.dto';
import { CreateBlogAuthorDto } from './dto/create-blog-author.dto';
import { BlogStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Marketing Blog & Articles CMS')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all blog taxonomy categories (public)' })
  @ApiResponse({ status: 200, description: 'Categories returned' })
  async getCategories() {
    return this.blogsService.getCategories();
  }

  @Public()
  @Get('tags')
  @ApiOperation({ summary: 'Get all blog topic tags (public)' })
  @ApiResponse({ status: 200, description: 'Tags returned' })
  async getTags() {
    return this.blogsService.getTags();
  }

  @Public()
  @Get('authors')
  @ApiOperation({ summary: 'Get all attributed blog authors (public)' })
  @ApiResponse({ status: 200, description: 'Authors returned' })
  async getAuthors() {
    return this.blogsService.getAuthors();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get blog articles with optional filtering (public defaults to PUBLISHED)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: BlogStatusEnum, required: false })
  @ApiResponse({ status: 200, description: 'Blogs list returned' })
  async getBlogs(
    @Query('categoryId') categoryId?: string,
    @Query('tag') tag?: string,
    @Query('authorId') authorId?: string,
    @Query('search') search?: string,
    @Query('status') status?: BlogStatusEnum,
  ) {
    return this.blogsService.getBlogs(categoryId, tag, authorId, search, status);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get single published article by slug with author and tags (public)' })
  @ApiResponse({ status: 200, description: 'Article returned' })
  async getBlogBySlug(@Param('slug') slug: string) {
    return this.blogsService.getBlogBySlug(slug);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('blogs.create', 'content.create')
  @ApiOperation({ summary: 'Create a new blog article draft or published post' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  async createBlog(@Body() dto: CreateBlogDto, @CurrentUser() user: JwtPayload) {
    return this.blogsService.createBlog(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('blogs.update', 'content.update')
  @ApiOperation({ summary: 'Update blog article content, tags, or publish status' })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  async updateBlog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBlogDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.blogsService.updateBlog(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('blogs.delete', 'content.delete')
  @ApiOperation({ summary: 'Soft-delete a blog article' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  async deleteBlog(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.blogsService.deleteBlog(id, user?.sub);
  }

  // Categories CRUD
  @ApiBearerAuth()
  @Post('categories')
  @Permissions('blogs.manage', 'content.create')
  @ApiOperation({ summary: 'Create a blog category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(@Body() dto: CreateBlogCategoryDto) {
    return this.blogsService.createCategory(dto);
  }

  @ApiBearerAuth()
  @Delete('categories/:id')
  @Permissions('blogs.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete a blog category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogsService.deleteCategory(id);
  }

  // Tags CRUD
  @ApiBearerAuth()
  @Post('tags')
  @Permissions('blogs.manage', 'content.create')
  @ApiOperation({ summary: 'Create a blog tag' })
  @ApiResponse({ status: 201, description: 'Tag created' })
  async createTag(@Body() dto: CreateBlogTagDto) {
    return this.blogsService.createTag(dto);
  }

  @ApiBearerAuth()
  @Delete('tags/:id')
  @Permissions('blogs.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete a blog tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted' })
  async deleteTag(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogsService.deleteTag(id);
  }

  // Authors CRUD
  @ApiBearerAuth()
  @Post('authors')
  @Permissions('blogs.manage', 'content.create')
  @ApiOperation({ summary: 'Link a user account as an attributed blog author' })
  @ApiResponse({ status: 201, description: 'Author linked' })
  async createAuthor(@Body() dto: CreateBlogAuthorDto) {
    return this.blogsService.createAuthor(dto);
  }

  @ApiBearerAuth()
  @Delete('authors/:id')
  @Permissions('blogs.manage', 'content.delete')
  @ApiOperation({ summary: 'Remove author attribution profile' })
  @ApiResponse({ status: 200, description: 'Author removed' })
  async deleteAuthor(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogsService.deleteAuthor(id);
  }
}

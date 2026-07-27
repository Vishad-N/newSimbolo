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
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioProjectDto } from './dto/create-portfolio-project.dto';
import { UpdatePortfolioProjectDto } from './dto/update-portfolio-project.dto';
import { CreatePortfolioCategoryDto } from './dto/create-portfolio-category.dto';
import { PortfolioStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Creative Portfolio & Project Showcase')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all portfolio taxonomy categories (public)' })
  @ApiResponse({ status: 200, description: 'Categories returned' })
  async getCategories() {
    return this.portfolioService.getCategories();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get portfolio projects list (public defaults to PUBLISHED)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'serviceId', required: false })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: PortfolioStatusEnum, required: false })
  @ApiResponse({ status: 200, description: 'Projects returned' })
  async getProjects(
    @Query('categoryId') categoryId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('search') search?: string,
    @Query('status') status?: PortfolioStatusEnum,
  ) {
    const feat = isFeatured !== undefined ? isFeatured === 'true' : undefined;
    return this.portfolioService.getProjects(categoryId, serviceId, feat, search, status);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get single portfolio project by slug (public)' })
  @ApiResponse({ status: 200, description: 'Project returned' })
  async getProjectBySlug(@Param('slug') slug: string) {
    return this.portfolioService.getProjectBySlug(slug);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('portfolio.create', 'content.create')
  @ApiOperation({ summary: 'Create a new creative showcase project' })
  @ApiResponse({ status: 201, description: 'Project created' })
  async createProject(@Body() dto: CreatePortfolioProjectDto, @CurrentUser() user: JwtPayload) {
    return this.portfolioService.createProject(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('portfolio.update', 'content.update')
  @ApiOperation({ summary: 'Update a portfolio project' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  async updateProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePortfolioProjectDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.portfolioService.updateProject(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('portfolio.delete', 'content.delete')
  @ApiOperation({ summary: 'Soft-delete a portfolio project' })
  @ApiResponse({ status: 200, description: 'Project deleted' })
  async deleteProject(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.portfolioService.deleteProject(id, user?.sub);
  }

  // Categories CRUD
  @ApiBearerAuth()
  @Post('categories')
  @Permissions('portfolio.manage', 'content.create')
  @ApiOperation({ summary: 'Create portfolio category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(@Body() dto: CreatePortfolioCategoryDto) {
    return this.portfolioService.createCategory(dto);
  }

  @ApiBearerAuth()
  @Delete('categories/:id')
  @Permissions('portfolio.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete portfolio category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioService.deleteCategory(id);
  }
}

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
import { ServicesCatalogService } from './services-catalog.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { CreateServiceFeatureDto } from './dto/create-service-feature.dto';
import { CreateServiceFaqDto } from './dto/create-service-faq.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Marketing Services Catalog')
@Controller('services')
export class ServicesCatalogController {
  constructor(private readonly servicesCatalogService: ServicesCatalogService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all service categories (public)' })
  @ApiResponse({ status: 200, description: 'Categories returned successfully' })
  async getCategories() {
    return this.servicesCatalogService.getCategories();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all marketing services with optional category and keyword search (public)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Services list returned' })
  async getServices(@Query('categoryId') categoryId?: string, @Query('search') search?: string) {
    return this.servicesCatalogService.getServices(categoryId, search);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get detailed service by slug including features, FAQs, and packages (public)' })
  @ApiResponse({ status: 200, description: 'Service details returned' })
  async getServiceBySlug(@Param('slug') slug: string) {
    return this.servicesCatalogService.getServiceBySlug(slug);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('services.manage', 'content.create')
  @ApiOperation({ summary: 'Create a new marketing service offering' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  async createService(@Body() dto: CreateServiceDto, @CurrentUser() user: JwtPayload) {
    return this.servicesCatalogService.createService(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('services.manage', 'content.update')
  @ApiOperation({ summary: 'Update an existing service offering' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  async updateService(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.servicesCatalogService.updateService(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('services.manage', 'content.delete')
  @ApiOperation({ summary: 'Soft-delete a marketing service offering' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  async deleteService(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.servicesCatalogService.deleteService(id, user?.sub);
  }

  // Categories CRUD
  @ApiBearerAuth()
  @Post('categories')
  @Permissions('services.manage', 'content.create')
  @ApiOperation({ summary: 'Create a service category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(@Body() dto: CreateServiceCategoryDto, @CurrentUser() user: JwtPayload) {
    return this.servicesCatalogService.createCategory(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete('categories/:id')
  @Permissions('services.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete a service category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesCatalogService.deleteCategory(id);
  }

  // Features CRUD
  @ApiBearerAuth()
  @Post('features')
  @Permissions('services.manage', 'content.create')
  @ApiOperation({ summary: 'Add a feature to a service' })
  @ApiResponse({ status: 201, description: 'Feature created' })
  async addFeature(@Body() dto: CreateServiceFeatureDto) {
    return this.servicesCatalogService.addFeature(dto);
  }

  @ApiBearerAuth()
  @Delete('features/:id')
  @Permissions('services.manage', 'content.delete')
  @ApiOperation({ summary: 'Remove a feature from a service' })
  @ApiResponse({ status: 200, description: 'Feature removed' })
  async deleteFeature(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesCatalogService.deleteFeature(id);
  }

  // FAQs CRUD
  @ApiBearerAuth()
  @Post('faqs')
  @Permissions('services.manage', 'content.create')
  @ApiOperation({ summary: 'Add an FAQ to a service' })
  @ApiResponse({ status: 201, description: 'FAQ created' })
  async addFaq(@Body() dto: CreateServiceFaqDto) {
    return this.servicesCatalogService.addFaq(dto);
  }

  @ApiBearerAuth()
  @Delete('faqs/:id')
  @Permissions('services.manage', 'content.delete')
  @ApiOperation({ summary: 'Remove an FAQ from a service' })
  @ApiResponse({ status: 200, description: 'FAQ removed' })
  async deleteFaq(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesCatalogService.deleteFaq(id);
  }
}

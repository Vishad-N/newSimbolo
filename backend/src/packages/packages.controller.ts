import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreatePackageFeatureDto } from './dto/create-package-feature.dto';
import { PackagePricingDto } from './dto/package-pricing.dto';
import { PackageTypeEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Service Pricing Packages & Retainers')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all service pricing packages (public)' })
  @ApiQuery({ name: 'serviceId', required: false })
  @ApiQuery({ name: 'type', enum: PackageTypeEnum, required: false })
  @ApiResponse({ status: 200, description: 'Packages list returned' })
  async getPackages(@Query('serviceId') serviceId?: string, @Query('type') type?: PackageTypeEnum) {
    return this.packagesService.getPackages(serviceId, type);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get single package details by slug (public)' })
  @ApiResponse({ status: 200, description: 'Package returned' })
  async getPackageBySlug(@Param('slug') slug: string) {
    return this.packagesService.getPackageBySlug(slug);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('packages.manage', 'content.create')
  @ApiOperation({ summary: 'Create a new pricing tier package' })
  @ApiResponse({ status: 201, description: 'Package created successfully' })
  async createPackage(@Body() dto: CreatePackageDto, @CurrentUser() user: JwtPayload) {
    return this.packagesService.createPackage(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('packages.manage', 'content.update')
  @ApiOperation({ summary: 'Update an existing pricing tier package' })
  @ApiResponse({ status: 200, description: 'Package updated successfully' })
  async updatePackage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePackageDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.packagesService.updatePackage(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('packages.manage', 'content.delete')
  @ApiOperation({ summary: 'Soft-delete a pricing tier package' })
  @ApiResponse({ status: 200, description: 'Package deleted successfully' })
  async deletePackage(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.packagesService.deletePackage(id, user?.sub);
  }

  // Features CRUD
  @ApiBearerAuth()
  @Post('features')
  @Permissions('packages.manage', 'content.create')
  @ApiOperation({ summary: 'Add a deliverable feature item to a package' })
  @ApiResponse({ status: 201, description: 'Feature added' })
  async addFeature(@Body() dto: CreatePackageFeatureDto) {
    return this.packagesService.addFeature(dto);
  }

  @ApiBearerAuth()
  @Delete('features/:id')
  @Permissions('packages.manage', 'content.delete')
  @ApiOperation({ summary: 'Remove a deliverable feature item from a package' })
  @ApiResponse({ status: 200, description: 'Feature removed' })
  async deleteFeature(@Param('id', ParseUUIDPipe) id: string) {
    return this.packagesService.deleteFeature(id);
  }

  // Pricings CRUD
  @ApiBearerAuth()
  @Post('pricings')
  @Permissions('packages.manage', 'content.create', 'content.update')
  @ApiOperation({ summary: 'Upsert currency-specific pricing schedule for a package' })
  @ApiResponse({ status: 201, description: 'Pricing upserted' })
  async upsertPricing(@Body() dto: PackagePricingDto) {
    return this.packagesService.upsertPricing(dto);
  }

  @ApiBearerAuth()
  @Delete('pricings/:id')
  @Permissions('packages.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete a currency-specific pricing schedule' })
  @ApiResponse({ status: 200, description: 'Pricing deleted' })
  async deletePricing(@Param('id', ParseUUIDPipe) id: string) {
    return this.packagesService.deletePricing(id);
  }
}

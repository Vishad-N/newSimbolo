import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Header,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SeoService } from './seo.service';
import { CreateSeoPageDto } from './dto/create-seo-page.dto';
import { UpdateSeoPageDto } from './dto/update-seo-page.dto';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { CreateSitemapEntryDto } from './dto/create-sitemap-entry.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('SEO Metadata, Redirects & XML Sitemaps')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Public()
  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml')
  @ApiOperation({ summary: 'Get dynamic XML sitemap for Google crawlers (public)' })
  @ApiQuery({ name: 'baseUrl', required: false, example: 'https://thesimbolo.com' })
  @ApiResponse({ status: 200, description: 'XML sitemap string returned' })
  async getSitemapXml(@Query('baseUrl') baseUrl?: string) {
    return this.seoService.generateXmlSitemap(baseUrl);
  }

  @Public()
  @Get('redirects')
  @ApiOperation({ summary: 'Get 301/302 HTTP redirect mapping rules (public)' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Redirect rules returned' })
  async getRedirects(@Query('isActive') isActive?: string) {
    const act = isActive !== undefined ? isActive === 'true' : undefined;
    return this.seoService.getRedirects(act);
  }

  @Public()
  @Get('sitemap-entries')
  @ApiOperation({ summary: 'Get sitemap config entries (public)' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Sitemap entries returned' })
  async getSitemapEntries(@Query('isActive') isActive?: string) {
    const act = isActive !== undefined ? isActive === 'true' : undefined;
    return this.seoService.getSitemapEntries(act);
  }

  @Public()
  @Get('page')
  @ApiOperation({ summary: 'Get SEO metadata by URL path (public)' })
  @ApiQuery({ name: 'path', required: true, example: '/services/seo' })
  @ApiResponse({ status: 200, description: 'SEO page metadata returned' })
  async getSeoByPath(@Query('path') path: string) {
    return this.seoService.getSeoByPath(path);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all SEO pages metadata (public)' })
  @ApiResponse({ status: 200, description: 'All SEO pages returned' })
  async getAllSeoPages() {
    return this.seoService.getAllSeoPages();
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('seo.create', 'content.create')
  @ApiOperation({ summary: 'Create SEO metadata for a path' })
  @ApiResponse({ status: 201, description: 'SEO page created' })
  async createSeoPage(@Body() dto: CreateSeoPageDto, @CurrentUser() user: JwtPayload) {
    return this.seoService.createSeoPage(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('seo.update', 'content.update')
  @ApiOperation({ summary: 'Update SEO meta tags, OpenGraph cards, or JSON-LD schema' })
  @ApiResponse({ status: 200, description: 'SEO page updated' })
  async updateSeoPage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSeoPageDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.seoService.updateSeoPage(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('seo.delete', 'content.delete')
  @ApiOperation({ summary: 'Delete SEO metadata entry' })
  @ApiResponse({ status: 200, description: 'SEO page deleted' })
  async deleteSeoPage(@Param('id', ParseUUIDPipe) id: string) {
    return this.seoService.deleteSeoPage(id);
  }

  // Redirects CRUD
  @ApiBearerAuth()
  @Post('redirects')
  @Permissions('seo.manage', 'content.create')
  @ApiOperation({ summary: 'Create 301/302 redirect rule' })
  @ApiResponse({ status: 201, description: 'Redirect rule created' })
  async createRedirect(@Body() dto: CreateRedirectDto) {
    return this.seoService.createRedirect(dto);
  }

  @ApiBearerAuth()
  @Delete('redirects/:id')
  @Permissions('seo.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete redirect rule' })
  @ApiResponse({ status: 200, description: 'Redirect rule deleted' })
  async deleteRedirect(@Param('id', ParseUUIDPipe) id: string) {
    return this.seoService.deleteRedirect(id);
  }

  // Sitemap Entries CRUD
  @ApiBearerAuth()
  @Post('sitemap-entries')
  @Permissions('seo.manage', 'content.create')
  @ApiOperation({ summary: 'Create XML sitemap entry' })
  @ApiResponse({ status: 201, description: 'Sitemap entry created' })
  async createSitemapEntry(@Body() dto: CreateSitemapEntryDto) {
    return this.seoService.createSitemapEntry(dto);
  }

  @ApiBearerAuth()
  @Delete('sitemap-entries/:id')
  @Permissions('seo.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete XML sitemap entry' })
  @ApiResponse({ status: 200, description: 'Sitemap entry deleted' })
  async deleteSitemapEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.seoService.deleteSitemapEntry(id);
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CaseStudiesService } from './case-studies.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { CreateCaseStudyCategoryDto } from './dto/create-case-study-category.dto';
import { CreateCaseStudyMetricDto } from './dto/create-case-study-metric.dto';
import { CreateBeforeAfterDto } from './dto/create-before-after.dto';
import { CaseStudyStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Client Case Studies & Success Stories')
@Controller('case-studies')
export class CaseStudiesController {
  constructor(private readonly caseStudiesService: CaseStudiesService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all case study industry categories (public)' })
  @ApiResponse({ status: 200, description: 'Categories returned' })
  async getCategories() {
    return this.caseStudiesService.getCategories();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get case studies list (public defaults to PUBLISHED)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'serviceId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: CaseStudyStatusEnum, required: false })
  @ApiResponse({ status: 200, description: 'Case studies returned' })
  async getCaseStudies(
    @Query('categoryId') categoryId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('search') search?: string,
    @Query('status') status?: CaseStudyStatusEnum,
  ) {
    return this.caseStudiesService.getCaseStudies(categoryId, serviceId, search, status);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get detailed case study by slug including KPIs and before/after sliders (public)' })
  @ApiResponse({ status: 200, description: 'Case study details returned' })
  async getCaseStudyBySlug(@Param('slug') slug: string) {
    return this.caseStudiesService.getCaseStudyBySlug(slug);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('casestudies.create', 'content.create')
  @ApiOperation({ summary: 'Create a new case study' })
  @ApiResponse({ status: 201, description: 'Case study created' })
  async createCaseStudy(@Body() dto: CreateCaseStudyDto, @CurrentUser() user: JwtPayload) {
    return this.caseStudiesService.createCaseStudy(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('casestudies.update', 'content.update')
  @ApiOperation({ summary: 'Update case study content, challenge, solution, or status' })
  @ApiResponse({ status: 200, description: 'Case study updated' })
  async updateCaseStudy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCaseStudyDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.caseStudiesService.updateCaseStudy(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('casestudies.delete', 'content.delete')
  @ApiOperation({ summary: 'Soft-delete a case study' })
  @ApiResponse({ status: 200, description: 'Case study deleted' })
  async deleteCaseStudy(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.caseStudiesService.deleteCaseStudy(id, user?.sub);
  }

  // Categories CRUD
  @ApiBearerAuth()
  @Post('categories')
  @Permissions('casestudies.manage', 'content.create')
  @ApiOperation({ summary: 'Create case study category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(@Body() dto: CreateCaseStudyCategoryDto) {
    return this.caseStudiesService.createCategory(dto);
  }

  @ApiBearerAuth()
  @Delete('categories/:id')
  @Permissions('casestudies.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete case study category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.caseStudiesService.deleteCategory(id);
  }

  // Metrics CRUD
  @ApiBearerAuth()
  @Post('metrics')
  @Permissions('casestudies.manage', 'content.create')
  @ApiOperation({ summary: 'Add a measurable KPI metric to a case study' })
  @ApiResponse({ status: 201, description: 'Metric added' })
  async addMetric(@Body() dto: CreateCaseStudyMetricDto) {
    return this.caseStudiesService.addMetric(dto);
  }

  @ApiBearerAuth()
  @Delete('metrics/:id')
  @Permissions('casestudies.manage', 'content.delete')
  @ApiOperation({ summary: 'Remove a KPI metric' })
  @ApiResponse({ status: 200, description: 'Metric removed' })
  async deleteMetric(@Param('id', ParseUUIDPipe) id: string) {
    return this.caseStudiesService.deleteMetric(id);
  }

  // Before/After CRUD
  @ApiBearerAuth()
  @Post('before-after')
  @Permissions('casestudies.manage', 'content.create')
  @ApiOperation({ summary: 'Add visual before/after comparison slider images' })
  @ApiResponse({ status: 201, description: 'Comparison slider added' })
  async addBeforeAfter(@Body() dto: CreateBeforeAfterDto) {
    return this.caseStudiesService.addBeforeAfter(dto);
  }

  @ApiBearerAuth()
  @Delete('before-after/:id')
  @Permissions('casestudies.manage', 'content.delete')
  @ApiOperation({ summary: 'Remove before/after comparison slider' })
  @ApiResponse({ status: 200, description: 'Slider removed' })
  async deleteBeforeAfter(@Param('id', ParseUUIDPipe) id: string) {
    return this.caseStudiesService.deleteBeforeAfter(id);
  }
}

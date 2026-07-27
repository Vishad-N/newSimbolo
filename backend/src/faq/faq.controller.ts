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
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { FAQStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Frequently Asked Questions (FAQ)')
@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all FAQ taxonomy categories (public)' })
  @ApiResponse({ status: 200, description: 'Categories returned' })
  async getCategories() {
    return this.faqService.getCategories();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get FAQs list with optional category or keyword filtering (public)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'serviceId', required: false })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: FAQStatusEnum, required: false })
  @ApiResponse({ status: 200, description: 'FAQs list returned' })
  async getFaqs(
    @Query('categoryId') categoryId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('search') search?: string,
    @Query('status') status?: FAQStatusEnum,
  ) {
    const feat = isFeatured !== undefined ? isFeatured === 'true' : undefined;
    return this.faqService.getFaqs(categoryId, serviceId, feat, search, status);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get FAQ details by UUID (public)' })
  @ApiResponse({ status: 200, description: 'FAQ returned' })
  async getFaqById(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.getFaqById(id);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('faqs.create', 'content.create')
  @ApiOperation({ summary: 'Create a new question and answer item' })
  @ApiResponse({ status: 201, description: 'FAQ created' })
  async createFaq(@Body() dto: CreateFaqDto, @CurrentUser() user: JwtPayload) {
    return this.faqService.createFaq(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('faqs.update', 'content.update')
  @ApiOperation({ summary: 'Update FAQ question, answer, category, or order index' })
  @ApiResponse({ status: 200, description: 'FAQ updated' })
  async updateFaq(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFaqDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.faqService.updateFaq(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('faqs.delete', 'content.delete')
  @ApiOperation({ summary: 'Soft-delete an FAQ item' })
  @ApiResponse({ status: 200, description: 'FAQ deleted' })
  async deleteFaq(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.faqService.deleteFaq(id, user?.sub);
  }

  // Categories CRUD
  @ApiBearerAuth()
  @Post('categories')
  @Permissions('faqs.manage', 'content.create')
  @ApiOperation({ summary: 'Create FAQ category tab' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(@Body() dto: CreateFaqCategoryDto) {
    return this.faqService.createCategory(dto);
  }

  @ApiBearerAuth()
  @Delete('categories/:id')
  @Permissions('faqs.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete FAQ category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.faqService.deleteCategory(id);
  }
}

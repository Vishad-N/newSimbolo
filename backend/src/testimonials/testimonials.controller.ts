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
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialStatusEnum } from '@prisma/client';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Client Reviews & Social Proof Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get client testimonials list (public defaults to APPROVED)' })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'caseStudyId', required: false })
  @ApiQuery({ name: 'status', enum: TestimonialStatusEnum, required: false })
  @ApiResponse({ status: 200, description: 'Testimonials returned' })
  async getTestimonials(
    @Query('isFeatured') isFeatured?: string,
    @Query('clientId') clientId?: string,
    @Query('caseStudyId') caseStudyId?: string,
    @Query('status') status?: TestimonialStatusEnum,
  ) {
    const feat = isFeatured !== undefined ? isFeatured === 'true' : undefined;
    return this.testimonialsService.getTestimonials(feat, clientId, caseStudyId, status);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get testimonial by UUID (public)' })
  @ApiResponse({ status: 200, description: 'Testimonial returned' })
  async getTestimonialById(@Param('id', ParseUUIDPipe) id: string) {
    return this.testimonialsService.getTestimonialById(id);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('testimonials.create', 'content.create')
  @ApiOperation({ summary: 'Create a client review or testimonial' })
  @ApiResponse({ status: 201, description: 'Testimonial created' })
  async createTestimonial(@Body() dto: CreateTestimonialDto, @CurrentUser() user: JwtPayload) {
    return this.testimonialsService.createTestimonial(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Permissions('testimonials.update', 'content.update')
  @ApiOperation({ summary: 'Update testimonial quote, rating, or approval status' })
  @ApiResponse({ status: 200, description: 'Testimonial updated' })
  async updateTestimonial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTestimonialDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.testimonialsService.updateTestimonial(id, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Permissions('testimonials.delete', 'content.delete')
  @ApiOperation({ summary: 'Soft-delete a testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial deleted' })
  async deleteTestimonial(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.testimonialsService.deleteTestimonial(id, user?.sub);
  }
}

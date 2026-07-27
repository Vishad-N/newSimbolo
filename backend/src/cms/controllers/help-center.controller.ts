import { Controller, Get, Patch, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CmsService } from '../cms.service';
import { UpdatePageSectionDto } from '../dto/update-page-section.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('CMS - Help Center')
@Controller('cms/help-center')
export class HelpCenterController {
  private readonly category = 'HELP_CENTER';

  constructor(private readonly cmsService: CmsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all configured Help Center sections and workflow articles (public)' })
  @ApiResponse({ status: 200, description: 'Help Center sections returned' })
  async getHelpCenter() {
    return this.cmsService.getPageSections(this.category);
  }

  @Public()
  @Get(':sectionKey')
  @ApiOperation({ summary: 'Get specific Help Center section by key (e.g. quick_actions, workflow)' })
  @ApiResponse({ status: 200, description: 'Section data returned' })
  async getSection(@Param('sectionKey') sectionKey: string) {
    return this.cmsService.getSection(this.category, sectionKey);
  }

  @ApiBearerAuth()
  @Patch()
  @Permissions('content.update')
  @ApiOperation({ summary: 'Update multiple Help Center sections at once' })
  @ApiResponse({ status: 200, description: 'Help Center sections updated' })
  async updateMultiple(@Body() sections: Record<string, any>, @CurrentUser() user: JwtPayload) {
    return this.cmsService.updateMultipleSections(this.category, sections, user?.sub);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('content.create', 'content.update')
  @ApiOperation({ summary: 'Create or update a specific Help Center section' })
  @ApiResponse({ status: 201, description: 'Section updated successfully' })
  async updateSection(@Body() dto: UpdatePageSectionDto, @CurrentUser() user: JwtPayload) {
    return this.cmsService.updateSection(this.category, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':sectionKey')
  @Permissions('content.delete')
  @ApiOperation({ summary: 'Delete a Help Center section' })
  @ApiResponse({ status: 200, description: 'Section deleted' })
  async deleteSection(@Param('sectionKey') sectionKey: string) {
    return this.cmsService.deleteSection(this.category, sectionKey);
  }
}

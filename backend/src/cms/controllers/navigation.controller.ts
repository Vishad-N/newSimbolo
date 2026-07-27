import { Controller, Get, Patch, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CmsService } from '../cms.service';
import { UpdatePageSectionDto } from '../dto/update-page-section.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('CMS - Navigation Manager')
@Controller('cms/navigation')
export class NavigationController {
  private readonly category = 'NAVIGATION';

  constructor(private readonly cmsService: CmsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all configured navigation menus (header, sidebar, footer links)' })
  @ApiResponse({ status: 200, description: 'Navigation menus returned' })
  async getNavigation() {
    return this.cmsService.getPageSections(this.category);
  }

  @Public()
  @Get(':sectionKey')
  @ApiOperation({ summary: 'Get specific navigation menu by key (e.g. header_nav, sidebar_nav)' })
  @ApiResponse({ status: 200, description: 'Menu data returned' })
  async getSection(@Param('sectionKey') sectionKey: string) {
    return this.cmsService.getSection(this.category, sectionKey);
  }

  @ApiBearerAuth()
  @Patch()
  @Permissions('content.update')
  @ApiOperation({ summary: 'Update multiple navigation menus at once' })
  @ApiResponse({ status: 200, description: 'Navigation menus updated' })
  async updateMultiple(@Body() sections: Record<string, any>, @CurrentUser() user: JwtPayload) {
    return this.cmsService.updateMultipleSections(this.category, sections, user?.sub);
  }

  @ApiBearerAuth()
  @Post()
  @Permissions('content.create', 'content.update')
  @ApiOperation({ summary: 'Create or update a specific navigation menu' })
  @ApiResponse({ status: 201, description: 'Menu updated successfully' })
  async updateSection(@Body() dto: UpdatePageSectionDto, @CurrentUser() user: JwtPayload) {
    return this.cmsService.updateSection(this.category, dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete(':sectionKey')
  @Permissions('content.delete')
  @ApiOperation({ summary: 'Delete a navigation menu' })
  @ApiResponse({ status: 200, description: 'Menu deleted' })
  async deleteSection(@Param('sectionKey') sectionKey: string) {
    return this.cmsService.deleteSection(this.category, sectionKey);
  }
}

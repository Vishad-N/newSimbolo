import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Global Settings & Theming')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get('theme')
  @ApiOperation({ summary: 'Get current visual branding and theme settings (publicly accessible)' })
  @ApiResponse({ status: 200, description: 'Theme returned successfully' })
  async getTheme() {
    return this.settingsService.getTheme();
  }

  @ApiBearerAuth()
  @Patch('theme')
  @Permissions('settings.manage', 'content.update')
  @ApiOperation({ summary: 'Update brand colors, typography, and logos' })
  @ApiResponse({ status: 200, description: 'Theme updated successfully' })
  async updateTheme(@Body() dto: UpdateThemeDto, @CurrentUser() user: JwtPayload) {
    return this.settingsService.updateTheme(dto, user?.sub);
  }

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get all publicly accessible runtime global settings (maintenance mode, socials, etc.)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category (e.g. SOCIALS, GENERAL)' })
  @ApiResponse({ status: 200, description: 'Public settings returned' })
  async getPublicSettings(@Query('category') category?: string) {
    return this.settingsService.getGlobalSettings(category, true);
  }

  @ApiBearerAuth()
  @Get('global')
  @Permissions('settings.read', 'content.read')
  @ApiOperation({ summary: 'Get all global settings (admin access required)' })
  @ApiQuery({ name: 'category', required: false })
  @ApiResponse({ status: 200, description: 'All settings returned' })
  async getGlobalSettings(@Query('category') category?: string) {
    return this.settingsService.getGlobalSettings(category, false);
  }

  @ApiBearerAuth()
  @Get('global/:key')
  @Permissions('settings.read', 'content.read')
  @ApiOperation({ summary: 'Get single setting value by unique key' })
  @ApiResponse({ status: 200, description: 'Setting returned' })
  async getSettingByKey(@Param('key') key: string) {
    return this.settingsService.getSettingByKey(key);
  }

  @ApiBearerAuth()
  @Post('global')
  @Permissions('settings.manage', 'content.create')
  @ApiOperation({ summary: 'Create or update (upsert) a global configuration setting' })
  @ApiResponse({ status: 201, description: 'Setting upserted successfully' })
  async upsertSetting(@Body() dto: UpdateSettingDto, @CurrentUser() user: JwtPayload) {
    return this.settingsService.upsertSetting(dto, user?.sub);
  }

  @ApiBearerAuth()
  @Delete('global/:key')
  @Permissions('settings.manage', 'content.delete')
  @ApiOperation({ summary: 'Delete a global setting by key' })
  @ApiResponse({ status: 200, description: 'Setting deleted successfully' })
  async deleteSetting(@Param('key') key: string) {
    return this.settingsService.deleteSetting(key);
  }
}

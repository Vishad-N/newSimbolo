import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ThemeSetting, GlobalSetting } from '@prisma/client';

@Injectable()
export class SettingsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('SettingsService');
  }

  async getTheme(): Promise<ThemeSetting> {
    const theme = await this.prisma.themeSetting.findFirst();
    if (!theme) {
      this.logger.log('No ThemeSetting found, initializing default theme configuration');
      return this.prisma.themeSetting.create({
        data: {
          primaryColor: '#14B8A6',
          secondaryColor: '#0F172A',
          accentColor: '#F59E0B',
          fontFamily: 'Inter',
        },
      });
    }
    return theme;
  }

  async updateTheme(dto: UpdateThemeDto, updatedBy?: string): Promise<ThemeSetting> {
    const existing = await this.getTheme();
    return this.prisma.themeSetting.update({
      where: { id: existing.id },
      data: {
        ...(dto.primaryColor !== undefined && { primaryColor: dto.primaryColor }),
        ...(dto.secondaryColor !== undefined && { secondaryColor: dto.secondaryColor }),
        ...(dto.accentColor !== undefined && { accentColor: dto.accentColor }),
        ...(dto.darkModeLogoUrl !== undefined && { darkModeLogoUrl: dto.darkModeLogoUrl }),
        ...(dto.lightModeLogoUrl !== undefined && { lightModeLogoUrl: dto.lightModeLogoUrl }),
        ...(dto.fontFamily !== undefined && { fontFamily: dto.fontFamily }),
        updatedBy: updatedBy || null,
      },
    });
  }

  async getGlobalSettings(category?: string, publicOnly?: boolean): Promise<GlobalSetting[]> {
    const where: any = {};
    if (category) {
      where.category = category.toUpperCase();
    }
    if (publicOnly) {
      where.isPublic = true;
    }
    return this.prisma.globalSetting.findMany({
      where,
      orderBy: { key: 'asc' },
    });
  }

  async getSettingByKey(key: string): Promise<GlobalSetting> {
    const setting = await this.prisma.globalSetting.findUnique({ where: { key } });
    return this.checkEntityExists(setting, 'GlobalSetting', key);
  }

  async upsertSetting(dto: UpdateSettingDto, updatedBy?: string): Promise<GlobalSetting> {
    const category = dto.category ? dto.category.toUpperCase() : 'GENERAL';
    return this.prisma.globalSetting.upsert({
      where: { key: dto.key },
      create: {
        key: dto.key,
        value: dto.value,
        description: dto.description || null,
        isPublic: dto.isPublic !== undefined ? dto.isPublic : false,
        category,
        updatedBy: updatedBy || null,
      },
      update: {
        value: dto.value,
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isPublic !== undefined && { isPublic: dto.isPublic }),
        category,
        updatedBy: updatedBy || null,
      },
    });
  }

  async deleteSetting(key: string): Promise<{ success: boolean }> {
    await this.getSettingByKey(key);
    await this.prisma.globalSetting.delete({ where: { key } });
    this.logger.log(`Deleted global setting key "${key}"`);
    return { success: true };
  }
}

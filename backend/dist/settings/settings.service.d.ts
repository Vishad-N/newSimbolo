import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ThemeSetting, GlobalSetting } from '@prisma/client';
export declare class SettingsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTheme(): Promise<ThemeSetting>;
    updateTheme(dto: UpdateThemeDto, updatedBy?: string): Promise<ThemeSetting>;
    getGlobalSettings(category?: string, publicOnly?: boolean): Promise<GlobalSetting[]>;
    getSettingByKey(key: string): Promise<GlobalSetting>;
    upsertSetting(dto: UpdateSettingDto, updatedBy?: string): Promise<GlobalSetting>;
    deleteSetting(key: string): Promise<{
        success: boolean;
    }>;
}

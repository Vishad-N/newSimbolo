import { SettingsService } from './settings.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getTheme(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        darkModeLogoUrl: string | null;
        lightModeLogoUrl: string | null;
        fontFamily: string;
    }>;
    updateTheme(dto: UpdateThemeDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        darkModeLogoUrl: string | null;
        lightModeLogoUrl: string | null;
        fontFamily: string;
    }>;
    getPublicSettings(category?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        description: string | null;
        value: string;
        isPublic: boolean;
        key: string;
        category: string;
    }[]>;
    getGlobalSettings(category?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        description: string | null;
        value: string;
        isPublic: boolean;
        key: string;
        category: string;
    }[]>;
    getSettingByKey(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        description: string | null;
        value: string;
        isPublic: boolean;
        key: string;
        category: string;
    }>;
    upsertSetting(dto: UpdateSettingDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        description: string | null;
        value: string;
        isPublic: boolean;
        key: string;
        category: string;
    }>;
    deleteSetting(key: string): Promise<{
        success: boolean;
    }>;
}

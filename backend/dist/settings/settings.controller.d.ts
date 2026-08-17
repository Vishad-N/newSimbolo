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
        darkModeLogoId: string | null;
        lightModeLogoId: string | null;
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
        darkModeLogoId: string | null;
        lightModeLogoId: string | null;
    }>;
    getPublicSettings(category?: string): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        key: string;
        description: string | null;
        isPublic: boolean;
        category: string;
    }[]>;
    getGlobalSettings(category?: string): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        key: string;
        description: string | null;
        isPublic: boolean;
        category: string;
    }[]>;
    getSettingByKey(key: string): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        key: string;
        description: string | null;
        isPublic: boolean;
        category: string;
    }>;
    upsertSetting(dto: UpdateSettingDto, user: JwtPayload): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        updatedBy: string | null;
        key: string;
        description: string | null;
        isPublic: boolean;
        category: string;
    }>;
    deleteSetting(key: string): Promise<{
        success: boolean;
    }>;
}

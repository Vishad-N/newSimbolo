"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('SettingsService');
        this.prisma = prisma;
    }
    async getTheme() {
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
    async updateTheme(dto, updatedBy) {
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
    async getGlobalSettings(category, publicOnly) {
        const where = {};
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
    async getSettingByKey(key) {
        const setting = await this.prisma.globalSetting.findUnique({ where: { key } });
        return this.checkEntityExists(setting, 'GlobalSetting', key);
    }
    async upsertSetting(dto, updatedBy) {
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
    async deleteSetting(key) {
        await this.getSettingByKey(key);
        await this.prisma.globalSetting.delete({ where: { key } });
        this.logger.log(`Deleted global setting key "${key}"`);
        return { success: true };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map
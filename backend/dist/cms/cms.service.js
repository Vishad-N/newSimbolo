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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
let CmsService = class CmsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('CmsService');
        this.prisma = prisma;
    }
    getFullKey(category, sectionKey) {
        return `${category.toLowerCase()}_${sectionKey.toLowerCase()}`;
    }
    parseJsonValue(val) {
        try {
            return JSON.parse(val);
        }
        catch {
            return val;
        }
    }
    async getPageSections(category) {
        const catUpper = category.toUpperCase();
        const settings = await this.prisma.globalSetting.findMany({
            where: { category: catUpper },
            orderBy: { key: 'asc' },
        });
        const result = {};
        const prefix = `${category.toLowerCase()}_`;
        for (const item of settings) {
            const shortKey = item.key.startsWith(prefix) ? item.key.slice(prefix.length) : item.key;
            result[shortKey] = this.parseJsonValue(item.value);
        }
        return result;
    }
    async getSection(category, sectionKey) {
        const fullKey = this.getFullKey(category, sectionKey);
        const setting = await this.prisma.globalSetting.findUnique({ where: { key: fullKey } });
        const valid = this.checkEntityExists(setting, 'PageSection', fullKey);
        return this.parseJsonValue(valid.value);
    }
    async updateSection(category, dto, updatedBy) {
        const catUpper = category.toUpperCase();
        const fullKey = this.getFullKey(category, dto.sectionKey);
        const valueString = typeof dto.content === 'string' ? dto.content : JSON.stringify(dto.content);
        const updated = await this.prisma.globalSetting.upsert({
            where: { key: fullKey },
            create: {
                key: fullKey,
                value: valueString,
                description: dto.description || `${category} section: ${dto.sectionKey}`,
                isPublic: true,
                category: catUpper,
                updatedBy: updatedBy || null,
            },
            update: {
                value: valueString,
                ...(dto.description !== undefined && { description: dto.description }),
                isPublic: true,
                category: catUpper,
                updatedBy: updatedBy || null,
            },
        });
        this.logger.log(`Updated CMS section "${fullKey}" in category ${catUpper}`);
        return this.parseJsonValue(updated.value);
    }
    async updateMultipleSections(category, sections, updatedBy) {
        for (const [key, content] of Object.entries(sections)) {
            await this.updateSection(category, { sectionKey: key, content }, updatedBy);
        }
        return this.getPageSections(category);
    }
    async deleteSection(category, sectionKey) {
        const fullKey = this.getFullKey(category, sectionKey);
        await this.getSection(category, sectionKey);
        await this.prisma.globalSetting.delete({ where: { key: fullKey } });
        this.logger.log(`Deleted CMS section "${fullKey}"`);
        return { success: true };
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CmsService);
//# sourceMappingURL=cms.service.js.map
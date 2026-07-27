import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePageSectionDto } from './dto/update-page-section.dto';

@Injectable()
export class CmsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('CmsService');
  }

  private getFullKey(category: string, sectionKey: string): string {
    return `${category.toLowerCase()}_${sectionKey.toLowerCase()}`;
  }

  private parseJsonValue(val: string): any {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }

  async getPageSections(category: string): Promise<Record<string, any>> {
    const catUpper = category.toUpperCase();
    const settings = await this.prisma.globalSetting.findMany({
      where: { category: catUpper },
      orderBy: { key: 'asc' },
    });

    const result: Record<string, any> = {};
    const prefix = `${category.toLowerCase()}_`;

    for (const item of settings) {
      const shortKey = item.key.startsWith(prefix) ? item.key.slice(prefix.length) : item.key;
      result[shortKey] = this.parseJsonValue(item.value);
    }

    return result;
  }

  async getSection(category: string, sectionKey: string): Promise<any> {
    const fullKey = this.getFullKey(category, sectionKey);
    const setting = await this.prisma.globalSetting.findUnique({ where: { key: fullKey } });
    const valid = this.checkEntityExists(setting, 'PageSection', fullKey);
    return this.parseJsonValue(valid.value);
  }

  async updateSection(category: string, dto: UpdatePageSectionDto, updatedBy?: string): Promise<any> {
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

  async updateMultipleSections(
    category: string,
    sections: Record<string, any>,
    updatedBy?: string,
  ): Promise<Record<string, any>> {
    for (const [key, content] of Object.entries(sections)) {
      await this.updateSection(category, { sectionKey: key, content }, updatedBy);
    }
    return this.getPageSections(category);
  }

  async deleteSection(category: string, sectionKey: string): Promise<{ success: boolean }> {
    const fullKey = this.getFullKey(category, sectionKey);
    await this.getSection(category, sectionKey);
    await this.prisma.globalSetting.delete({ where: { key: fullKey } });
    this.logger.log(`Deleted CMS section "${fullKey}"`);
    return { success: true };
  }
}

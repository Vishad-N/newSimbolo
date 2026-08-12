import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePageSectionDto } from './dto/update-page-section.dto';
export declare class CmsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getFullKey;
    private parseJsonValue;
    getPageSections(category: string): Promise<Record<string, any>>;
    getSection(category: string, sectionKey: string): Promise<any>;
    updateSection(category: string, dto: UpdatePageSectionDto, updatedBy?: string): Promise<any>;
    updateMultipleSections(category: string, sections: Record<string, any>, updatedBy?: string): Promise<Record<string, any>>;
    deleteSection(category: string, sectionKey: string): Promise<{
        success: boolean;
    }>;
}

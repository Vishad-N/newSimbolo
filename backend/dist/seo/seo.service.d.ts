import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeoPageDto } from './dto/create-seo-page.dto';
import { UpdateSeoPageDto } from './dto/update-seo-page.dto';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { CreateSitemapEntryDto } from './dto/create-sitemap-entry.dto';
import { SEOPage, Redirect, SitemapEntry } from '@prisma/client';
export declare class SeoService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSeoByPath(path: string): Promise<SEOPage | null>;
    getAllSeoPages(): Promise<SEOPage[]>;
    createSeoPage(dto: CreateSeoPageDto, createdBy?: string): Promise<SEOPage>;
    updateSeoPage(id: string, dto: UpdateSeoPageDto, updatedBy?: string): Promise<SEOPage>;
    deleteSeoPage(id: string): Promise<{
        success: boolean;
    }>;
    getRedirects(isActive?: boolean): Promise<Redirect[]>;
    createRedirect(dto: CreateRedirectDto): Promise<Redirect>;
    deleteRedirect(id: string): Promise<{
        success: boolean;
    }>;
    getSitemapEntries(isActive?: boolean): Promise<SitemapEntry[]>;
    createSitemapEntry(dto: CreateSitemapEntryDto): Promise<SitemapEntry>;
    deleteSitemapEntry(id: string): Promise<{
        success: boolean;
    }>;
    generateXmlSitemap(baseUrl?: string): Promise<string>;
}

import { SeoService } from './seo.service';
import { CreateSeoPageDto } from './dto/create-seo-page.dto';
import { UpdateSeoPageDto } from './dto/update-seo-page.dto';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { CreateSitemapEntryDto } from './dto/create-sitemap-entry.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class SeoController {
    private readonly seoService;
    constructor(seoService: SeoService);
    getSitemapXml(baseUrl?: string): Promise<string>;
    getRedirects(isActive?: string): Promise<{
        statusCode: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sourcePath: string;
        targetPath: string;
        isActive: boolean;
    }[]>;
    getSitemapEntries(isActive?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        isActive: boolean;
        loc: string;
        changefreq: string;
        lastmod: Date;
    }[]>;
    getSeoByPath(path: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        path: string;
        metaTitle: string;
        metaDescription: string;
        keywords: string | null;
        canonicalUrl: string | null;
        ogTitle: string | null;
        ogDescription: string | null;
        ogImageId: string | null;
        twitterCard: string;
        schemaJson: string | null;
        indexable: boolean;
        followable: boolean;
    } | null>;
    getAllSeoPages(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        path: string;
        metaTitle: string;
        metaDescription: string;
        keywords: string | null;
        canonicalUrl: string | null;
        ogTitle: string | null;
        ogDescription: string | null;
        ogImageId: string | null;
        twitterCard: string;
        schemaJson: string | null;
        indexable: boolean;
        followable: boolean;
    }[]>;
    createSeoPage(dto: CreateSeoPageDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        path: string;
        metaTitle: string;
        metaDescription: string;
        keywords: string | null;
        canonicalUrl: string | null;
        ogTitle: string | null;
        ogDescription: string | null;
        ogImageId: string | null;
        twitterCard: string;
        schemaJson: string | null;
        indexable: boolean;
        followable: boolean;
    }>;
    updateSeoPage(id: string, dto: UpdateSeoPageDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        path: string;
        metaTitle: string;
        metaDescription: string;
        keywords: string | null;
        canonicalUrl: string | null;
        ogTitle: string | null;
        ogDescription: string | null;
        ogImageId: string | null;
        twitterCard: string;
        schemaJson: string | null;
        indexable: boolean;
        followable: boolean;
    }>;
    deleteSeoPage(id: string): Promise<{
        success: boolean;
    }>;
    createRedirect(dto: CreateRedirectDto): Promise<{
        statusCode: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sourcePath: string;
        targetPath: string;
        isActive: boolean;
    }>;
    deleteRedirect(id: string): Promise<{
        success: boolean;
    }>;
    createSitemapEntry(dto: CreateSitemapEntryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        priority: number;
        isActive: boolean;
        loc: string;
        changefreq: string;
        lastmod: Date;
    }>;
    deleteSitemapEntry(id: string): Promise<{
        success: boolean;
    }>;
}

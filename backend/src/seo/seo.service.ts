import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeoPageDto } from './dto/create-seo-page.dto';
import { UpdateSeoPageDto } from './dto/update-seo-page.dto';
import { CreateRedirectDto } from './dto/create-redirect.dto';
import { CreateSitemapEntryDto } from './dto/create-sitemap-entry.dto';
import { SEOPage, Redirect, SitemapEntry } from '@prisma/client';
import { CustomConflictException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class SeoService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('SeoService');
  }

  async getSeoByPath(path: string): Promise<SEOPage | null> {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return this.prisma.sEOPage.findUnique({
      where: { path: normalizedPath },
    });
  }

  async getAllSeoPages(): Promise<SEOPage[]> {
    return this.prisma.sEOPage.findMany({
      orderBy: { path: 'asc' },
    });
  }

  async createSeoPage(dto: CreateSeoPageDto, createdBy?: string): Promise<SEOPage> {
    const normalizedPath = dto.path.startsWith('/') ? dto.path : `/${dto.path}`;
    const existing = await this.prisma.sEOPage.findUnique({ where: { path: normalizedPath } });
    if (existing) {
      throw new CustomConflictException(`SEO page for path "${normalizedPath}" already exists`);
    }

    const created = await this.prisma.sEOPage.create({
      data: {
        path: normalizedPath,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        keywords: dto.keywords || null,
        canonicalUrl: dto.canonicalUrl || null,
        ogTitle: dto.ogTitle || null,
        ogDescription: dto.ogDescription || null,
        ogImageId: dto.ogImageId || null,
        twitterCard: dto.twitterCard || 'summary_large_image',
        schemaJson: dto.schemaJson || null,
        indexable: dto.indexable !== undefined ? dto.indexable : true,
        followable: dto.followable !== undefined ? dto.followable : true,
        createdBy: createdBy || null,
      },
    });

    this.logger.log(`Created SEO metadata for path "${created.path}" (ID: ${created.id})`);
    return created;
  }

  async updateSeoPage(id: string, dto: UpdateSeoPageDto, updatedBy?: string): Promise<SEOPage> {
    const page = this.checkEntityExists(await this.prisma.sEOPage.findUnique({ where: { id } }), 'SEOPage', id);

    let path = page.path;
    if (dto.path && dto.path !== page.path) {
      path = dto.path.startsWith('/') ? dto.path : `/${dto.path}`;
      const conflict = await this.prisma.sEOPage.findFirst({ where: { path, id: { not: id } } });
      if (conflict) {
        throw new CustomConflictException(`SEO page path "${path}" already exists`);
      }
    }

    return this.prisma.sEOPage.update({
      where: { id },
      data: {
        ...(dto.path !== undefined && { path }),
        ...(dto.metaTitle !== undefined && { metaTitle: dto.metaTitle }),
        ...(dto.metaDescription !== undefined && { metaDescription: dto.metaDescription }),
        ...(dto.keywords !== undefined && { keywords: dto.keywords }),
        ...(dto.canonicalUrl !== undefined && { canonicalUrl: dto.canonicalUrl }),
        ...(dto.ogTitle !== undefined && { ogTitle: dto.ogTitle }),
        ...(dto.ogDescription !== undefined && { ogDescription: dto.ogDescription }),
        ...(dto.ogImageId !== undefined && { ogImageId: dto.ogImageId }),
        ...(dto.twitterCard !== undefined && { twitterCard: dto.twitterCard }),
        ...(dto.schemaJson !== undefined && { schemaJson: dto.schemaJson }),
        ...(dto.indexable !== undefined && { indexable: dto.indexable }),
        ...(dto.followable !== undefined && { followable: dto.followable }),
        updatedBy: updatedBy || null,
      },
    });
  }

  async deleteSeoPage(id: string): Promise<{ success: boolean }> {
    const page = await this.prisma.sEOPage.findUnique({ where: { id } });
    this.checkEntityExists(page, 'SEOPage', id);
    await this.prisma.sEOPage.delete({ where: { id } });
    return { success: true };
  }

  // Redirects
  async getRedirects(isActive?: boolean): Promise<Redirect[]> {
    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    return this.prisma.redirect.findMany({
      where,
      orderBy: { sourcePath: 'asc' },
    });
  }

  async createRedirect(dto: CreateRedirectDto): Promise<Redirect> {
    const sourcePath = dto.sourcePath.startsWith('/') ? dto.sourcePath : `/${dto.sourcePath}`;
    const targetPath = dto.targetPath.startsWith('/') ? dto.targetPath : `/${dto.targetPath}`;
    const existing = await this.prisma.redirect.findUnique({ where: { sourcePath } });
    if (existing) {
      throw new CustomConflictException(`Redirect rule for "${sourcePath}" already exists`);
    }
    return this.prisma.redirect.create({
      data: {
        sourcePath,
        targetPath,
        statusCode: dto.statusCode !== undefined ? dto.statusCode : 301,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async deleteRedirect(id: string): Promise<{ success: boolean }> {
    const r = await this.prisma.redirect.findUnique({ where: { id } });
    this.checkEntityExists(r, 'Redirect', id);
    await this.prisma.redirect.delete({ where: { id } });
    return { success: true };
  }

  // Sitemap Entries
  async getSitemapEntries(isActive?: boolean): Promise<SitemapEntry[]> {
    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    return this.prisma.sitemapEntry.findMany({
      where,
      orderBy: { priority: 'desc' },
    });
  }

  async createSitemapEntry(dto: CreateSitemapEntryDto): Promise<SitemapEntry> {
    const loc = dto.loc.startsWith('/') ? dto.loc : `/${dto.loc}`;
    const existing = await this.prisma.sitemapEntry.findUnique({ where: { loc } });
    if (existing) {
      throw new CustomConflictException(`Sitemap entry for "${loc}" already exists`);
    }
    return this.prisma.sitemapEntry.create({
      data: {
        loc,
        changefreq: dto.changefreq || 'weekly',
        priority: dto.priority !== undefined ? dto.priority : 0.8,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async deleteSitemapEntry(id: string): Promise<{ success: boolean }> {
    const se = await this.prisma.sitemapEntry.findUnique({ where: { id } });
    this.checkEntityExists(se, 'SitemapEntry', id);
    await this.prisma.sitemapEntry.delete({ where: { id } });
    return { success: true };
  }

  async generateXmlSitemap(baseUrl: string = 'https://thesimbolo.com'): Promise<string> {
    const entries = await this.getSitemapEntries(true);
    const urls = entries
      .map(
        (e) => `  <url>
    <loc>${baseUrl.replace(/\/$/, '')}${e.loc}</loc>
    <lastmod>${e.lastmod.toISOString().split('T')[0]}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }
}

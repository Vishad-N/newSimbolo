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
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let SeoService = class SeoService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('SeoService');
        this.prisma = prisma;
    }
    async getSeoByPath(path) {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return this.prisma.sEOPage.findUnique({
            where: { path: normalizedPath },
        });
    }
    async getAllSeoPages() {
        return this.prisma.sEOPage.findMany({
            orderBy: { path: 'asc' },
        });
    }
    async createSeoPage(dto, createdBy) {
        const normalizedPath = dto.path.startsWith('/') ? dto.path : `/${dto.path}`;
        const existing = await this.prisma.sEOPage.findUnique({ where: { path: normalizedPath } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`SEO page for path "${normalizedPath}" already exists`);
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
    async updateSeoPage(id, dto, updatedBy) {
        const page = this.checkEntityExists(await this.prisma.sEOPage.findUnique({ where: { id } }), 'SEOPage', id);
        let path = page.path;
        if (dto.path && dto.path !== page.path) {
            path = dto.path.startsWith('/') ? dto.path : `/${dto.path}`;
            const conflict = await this.prisma.sEOPage.findFirst({ where: { path, id: { not: id } } });
            if (conflict) {
                throw new custom_exceptions_1.CustomConflictException(`SEO page path "${path}" already exists`);
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
    async deleteSeoPage(id) {
        const page = await this.prisma.sEOPage.findUnique({ where: { id } });
        this.checkEntityExists(page, 'SEOPage', id);
        await this.prisma.sEOPage.delete({ where: { id } });
        return { success: true };
    }
    // Redirects
    async getRedirects(isActive) {
        const where = {};
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        return this.prisma.redirect.findMany({
            where,
            orderBy: { sourcePath: 'asc' },
        });
    }
    async createRedirect(dto) {
        const sourcePath = dto.sourcePath.startsWith('/') ? dto.sourcePath : `/${dto.sourcePath}`;
        const targetPath = dto.targetPath.startsWith('/') ? dto.targetPath : `/${dto.targetPath}`;
        const existing = await this.prisma.redirect.findUnique({ where: { sourcePath } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Redirect rule for "${sourcePath}" already exists`);
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
    async deleteRedirect(id) {
        const r = await this.prisma.redirect.findUnique({ where: { id } });
        this.checkEntityExists(r, 'Redirect', id);
        await this.prisma.redirect.delete({ where: { id } });
        return { success: true };
    }
    // Sitemap Entries
    async getSitemapEntries(isActive) {
        const where = {};
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        return this.prisma.sitemapEntry.findMany({
            where,
            orderBy: { priority: 'desc' },
        });
    }
    async createSitemapEntry(dto) {
        const loc = dto.loc.startsWith('/') ? dto.loc : `/${dto.loc}`;
        const existing = await this.prisma.sitemapEntry.findUnique({ where: { loc } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Sitemap entry for "${loc}" already exists`);
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
    async deleteSitemapEntry(id) {
        const se = await this.prisma.sitemapEntry.findUnique({ where: { id } });
        this.checkEntityExists(se, 'SitemapEntry', id);
        await this.prisma.sitemapEntry.delete({ where: { id } });
        return { success: true };
    }
    async generateXmlSitemap(baseUrl = 'https://thesimbolo.com') {
        const entries = await this.getSitemapEntries(true);
        const urls = entries
            .map((e) => `  <url>
    <loc>${baseUrl.replace(/\/$/, '')}${e.loc}</loc>
    <lastmod>${e.lastmod.toISOString().split('T')[0]}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`)
            .join('\n');
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    }
};
exports.SeoService = SeoService;
exports.SeoService = SeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeoService);
//# sourceMappingURL=seo.service.js.map
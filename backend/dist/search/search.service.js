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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
let SearchService = class SearchService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('SearchService');
        this.prisma = prisma;
    }
    async search(query, userId) {
        const searchTerm = query.q.trim();
        const entities = new Set(query.entities ?? [
            'clients',
            'companies',
            'projects',
            'orders',
            'services',
            'packages',
            'blogs',
            'case-studies',
            'media',
            'support-tickets',
            'team-members',
        ]);
        const perEntityLimit = Math.min(query.limit ?? 20, 20);
        const results = [];
        if (entities.has('clients'))
            results.push(...(await this.searchClients(searchTerm, perEntityLimit)));
        if (entities.has('companies'))
            results.push(...(await this.searchCompanies(searchTerm, perEntityLimit)));
        if (entities.has('projects'))
            results.push(...(await this.searchProjects(searchTerm, perEntityLimit)));
        if (entities.has('orders'))
            results.push(...(await this.searchOrders(searchTerm, perEntityLimit)));
        if (entities.has('services'))
            results.push(...(await this.searchServices(searchTerm, perEntityLimit)));
        if (entities.has('packages'))
            results.push(...(await this.searchPackages(searchTerm, perEntityLimit)));
        if (entities.has('blogs'))
            results.push(...(await this.searchBlogs(searchTerm, perEntityLimit)));
        if (entities.has('case-studies'))
            results.push(...(await this.searchCaseStudies(searchTerm, perEntityLimit)));
        if (entities.has('media'))
            results.push(...(await this.searchMedia(searchTerm, perEntityLimit)));
        if (entities.has('support-tickets'))
            results.push(...(await this.searchTickets(searchTerm, perEntityLimit)));
        if (entities.has('team-members'))
            results.push(...(await this.searchTeamMembers(searchTerm, perEntityLimit)));
        if (userId)
            await this.recordSearch(userId, searchTerm);
        const ranked = results.sort((left, right) => right.score - left.score);
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const start = (page - 1) * limit;
        return {
            data: ranked.slice(start, start + limit),
            meta: { total: ranked.length, page, limit, totalPages: Math.ceil(ranked.length / limit) },
        };
    }
    async recentSearches(userId) {
        const records = await this.prisma.globalSetting.findMany({
            where: { category: `SEARCH_HISTORY:${userId}` },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        return {
            data: records.map((record) => JSON.parse(record.value)),
            meta: { total: records.length },
        };
    }
    score(title, subtitle, query) {
        const normalizedTitle = title.toLowerCase();
        const normalizedSubtitle = subtitle?.toLowerCase() ?? '';
        const normalizedQuery = query.toLowerCase();
        if (normalizedTitle === normalizedQuery)
            return 100;
        if (normalizedTitle.startsWith(normalizedQuery))
            return 80;
        if (normalizedTitle.includes(normalizedQuery))
            return 60;
        if (normalizedSubtitle.includes(normalizedQuery))
            return 30;
        return 10;
    }
    contains(query) {
        return { contains: query, mode: 'insensitive' };
    }
    async recordSearch(userId, query) {
        await this.prisma.globalSetting.create({
            data: {
                key: `search:${userId}:${Date.now()}`,
                value: JSON.stringify({ query, searchedAt: new Date().toISOString() }),
                category: `SEARCH_HISTORY:${userId}`,
                isPublic: false,
            },
        });
    }
    async searchClients(query, take) {
        const rows = await this.prisma.clientProfile.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { user: { firstName: this.contains(query) } },
                    { user: { lastName: this.contains(query) } },
                    { user: { email: this.contains(query) } },
                    { company: { name: this.contains(query) } },
                ],
            },
            include: { user: true, company: true },
            take,
        });
        return rows.map((row) => ({
            entity: 'clients',
            id: row.id,
            title: `${row.user.firstName} ${row.user.lastName}`,
            subtitle: row.company?.name ?? row.user.email,
            url: `/admin/clients/${row.id}`,
            score: this.score(`${row.user.firstName} ${row.user.lastName}`, row.company?.name ?? row.user.email, query),
        }));
    }
    async searchCompanies(query, take) {
        const rows = await this.prisma.company.findMany({
            where: {
                deletedAt: null,
                OR: [{ name: this.contains(query) }, { industry: this.contains(query) }, { website: this.contains(query) }],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'companies',
            id: row.id,
            title: row.name,
            subtitle: row.industry,
            url: `/admin/companies/${row.id}`,
            score: this.score(row.name, row.industry, query),
        }));
    }
    async searchProjects(query, take) {
        const rows = await this.prisma.project.findMany({
            where: {
                deletedAt: null,
                OR: [{ name: this.contains(query) }, { description: this.contains(query) }, { slug: this.contains(query) }],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'projects',
            id: row.id,
            title: row.name,
            subtitle: row.status,
            url: `/admin/projects/${row.id}`,
            score: this.score(row.name, row.description, query),
        }));
    }
    async searchOrders(query, take) {
        const rows = await this.prisma.order.findMany({
            where: { deletedAt: null, OR: [{ orderNumber: this.contains(query) }, { notes: this.contains(query) }] },
            take,
        });
        return rows.map((row) => ({
            entity: 'orders',
            id: row.id,
            title: row.orderNumber,
            subtitle: row.status,
            url: `/admin/orders/${row.id}`,
            score: this.score(row.orderNumber, row.notes, query),
        }));
    }
    async searchServices(query, take) {
        const rows = await this.prisma.service.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { name: this.contains(query) },
                    { shortDescription: this.contains(query) },
                    { fullDescription: this.contains(query) },
                ],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'services',
            id: row.id,
            title: row.name,
            subtitle: row.shortDescription,
            url: `/admin/services/${row.id}`,
            score: this.score(row.name, row.shortDescription, query),
        }));
    }
    async searchPackages(query, take) {
        const rows = await this.prisma.package.findMany({
            where: {
                deletedAt: null,
                OR: [{ name: this.contains(query) }, { description: this.contains(query) }, { slug: this.contains(query) }],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'packages',
            id: row.id,
            title: row.name,
            subtitle: row.description,
            url: `/admin/packages/${row.id}`,
            score: this.score(row.name, row.description, query),
        }));
    }
    async searchBlogs(query, take) {
        const rows = await this.prisma.blog.findMany({
            where: {
                deletedAt: null,
                OR: [{ title: this.contains(query) }, { excerpt: this.contains(query) }, { content: this.contains(query) }],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'blogs',
            id: row.id,
            title: row.title,
            subtitle: row.excerpt,
            url: `/admin/blogs/${row.id}`,
            score: this.score(row.title, row.excerpt, query),
        }));
    }
    async searchCaseStudies(query, take) {
        const rows = await this.prisma.caseStudy.findMany({
            where: {
                deletedAt: null,
                OR: [{ title: this.contains(query) }, { summary: this.contains(query) }, { clientName: this.contains(query) }],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'case-studies',
            id: row.id,
            title: row.title,
            subtitle: row.clientName,
            url: `/admin/case-studies/${row.id}`,
            score: this.score(row.title, row.clientName ?? row.summary, query),
        }));
    }
    async searchMedia(query, take) {
        const rows = await this.prisma.mediaAsset.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { fileName: this.contains(query) },
                    { originalName: this.contains(query) },
                    { mimeType: this.contains(query) },
                ],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'media',
            id: row.id,
            title: row.originalName,
            subtitle: row.mimeType,
            url: row.cdnUrl,
            score: this.score(row.originalName, row.fileName, query),
        }));
    }
    async searchTickets(query, take) {
        const rows = await this.prisma.supportTicket.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { ticketNumber: this.contains(query) },
                    { subject: this.contains(query) },
                    { description: this.contains(query) },
                ],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'support-tickets',
            id: row.id,
            title: row.ticketNumber,
            subtitle: row.subject,
            url: `/admin/support/${row.id}`,
            score: this.score(row.ticketNumber, row.subject, query),
        }));
    }
    async searchTeamMembers(query, take) {
        const rows = await this.prisma.user.findMany({
            where: {
                teamMembers: { some: {} },
                OR: [{ firstName: this.contains(query) }, { lastName: this.contains(query) }, { email: this.contains(query) }],
            },
            take,
        });
        return rows.map((row) => ({
            entity: 'team-members',
            id: row.id,
            title: `${row.firstName} ${row.lastName}`,
            subtitle: row.email,
            url: `/admin/team/${row.id}`,
            score: this.score(`${row.firstName} ${row.lastName}`, row.email, query),
        }));
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map
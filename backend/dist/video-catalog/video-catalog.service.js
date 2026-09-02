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
exports.VideoCatalogService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let VideoCatalogService = class VideoCatalogService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('VideoCatalogService');
        this.prisma = prisma;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getItems(categoryId, search, status) {
        const where = { deletedAt: null };
        if (status === 'ALL') {
            // No status filter — used by the admin catalog manager to show hidden/archived cards too.
        }
        else if (status) {
            where.status = status;
        }
        else {
            where.status = client_1.VideoCatalogStatusEnum.PUBLISHED;
        }
        if (categoryId) {
            where.categories = { some: { id: categoryId } };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { shortDescription: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ];
        }
        return this.prisma.videoCatalogItem.findMany({
            where,
            include: { categories: true },
            orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async getItemBySlug(slug) {
        const item = await this.prisma.videoCatalogItem.findUnique({
            where: { slug },
            include: { categories: true },
        });
        return this.checkEntityExists(item, 'VideoCatalogItem', slug);
    }
    async createItem(dto, createdBy) {
        const slug = this.generateSlug(dto.title);
        const existing = await this.prisma.videoCatalogItem.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Video service "${dto.title}" or slug "${slug}" already exists`);
        }
        if (dto.categoryIds?.length) {
            const count = await this.prisma.videoCatalogCategory.count({ where: { id: { in: dto.categoryIds } } });
            if (count !== dto.categoryIds.length) {
                throw new custom_exceptions_1.CustomConflictException('One or more category IDs are invalid');
            }
        }
        const created = await this.prisma.videoCatalogItem.create({
            data: {
                title: dto.title,
                slug,
                thumbnail: dto.thumbnail,
                previewType: dto.previewType || 'YOUTUBE',
                previewUrl: dto.previewUrl,
                shortDescription: dto.shortDescription,
                fullDescription: dto.fullDescription || null,
                hourlyRate: dto.hourlyRate !== undefined ? dto.hourlyRate : 0,
                currency: dto.currency || 'INR',
                estimatedDelivery: dto.estimatedDelivery || null,
                recommendedDuration: dto.recommendedDuration || null,
                complexity: dto.complexity || 'MEDIUM',
                tags: dto.tags || [],
                badge: dto.badge || null,
                status: dto.status || 'PUBLISHED',
                featured: dto.featured !== undefined ? dto.featured : false,
                displayOrder: dto.displayOrder !== undefined ? dto.displayOrder : 0,
                ctaText: dto.ctaText || null,
                ctaLink: dto.ctaLink || null,
                createdBy: createdBy || null,
                categories: dto.categoryIds?.length ? { connect: dto.categoryIds.map((id) => ({ id })) } : undefined,
            },
            include: { categories: true },
        });
        this.logger.log(`Created video catalog item "${created.title}" (ID: ${created.id})`);
        return created;
    }
    async updateItem(id, dto, updatedBy) {
        const item = this.checkEntityExists(await this.prisma.videoCatalogItem.findUnique({ where: { id } }), 'VideoCatalogItem', id);
        let slug = item.slug;
        if (dto.title && dto.title !== item.title) {
            slug = this.generateSlug(dto.title);
            const conflict = await this.prisma.videoCatalogItem.findFirst({ where: { slug, id: { not: id } } });
            if (conflict) {
                throw new custom_exceptions_1.CustomConflictException(`Video service title "${dto.title}" already exists`);
            }
        }
        if (dto.categoryIds?.length) {
            const count = await this.prisma.videoCatalogCategory.count({ where: { id: { in: dto.categoryIds } } });
            if (count !== dto.categoryIds.length) {
                throw new custom_exceptions_1.CustomConflictException('One or more category IDs are invalid');
            }
        }
        return this.prisma.videoCatalogItem.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title, slug }),
                ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail }),
                ...(dto.previewType !== undefined && { previewType: dto.previewType }),
                ...(dto.previewUrl !== undefined && { previewUrl: dto.previewUrl }),
                ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
                ...(dto.fullDescription !== undefined && { fullDescription: dto.fullDescription }),
                ...(dto.hourlyRate !== undefined && { hourlyRate: dto.hourlyRate }),
                ...(dto.currency !== undefined && { currency: dto.currency }),
                ...(dto.estimatedDelivery !== undefined && { estimatedDelivery: dto.estimatedDelivery }),
                ...(dto.recommendedDuration !== undefined && { recommendedDuration: dto.recommendedDuration }),
                ...(dto.complexity !== undefined && { complexity: dto.complexity }),
                ...(dto.tags !== undefined && { tags: dto.tags }),
                ...(dto.badge !== undefined && { badge: dto.badge }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.featured !== undefined && { featured: dto.featured }),
                ...(dto.displayOrder !== undefined && { displayOrder: dto.displayOrder }),
                ...(dto.ctaText !== undefined && { ctaText: dto.ctaText }),
                ...(dto.ctaLink !== undefined && { ctaLink: dto.ctaLink }),
                ...(dto.categoryIds !== undefined && { categories: { set: dto.categoryIds.map((id) => ({ id })) } }),
                updatedBy: updatedBy || null,
            },
            include: { categories: true },
        });
    }
    async deleteItem(id, deletedBy) {
        const item = await this.prisma.videoCatalogItem.findUnique({ where: { id } });
        this.checkEntityExists(item, 'VideoCatalogItem', id);
        await this.prisma.videoCatalogItem.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy || null },
        });
        this.logger.log(`Soft-deleted video catalog item ID: ${id}`);
        return { success: true };
    }
    async reorderItems(orderedIds) {
        await this.prisma.$transaction(orderedIds.map((id, index) => this.prisma.videoCatalogItem.update({ where: { id }, data: { displayOrder: index } })));
        return { success: true };
    }
    // Categories
    async getCategories() {
        return this.prisma.videoCatalogCategory.findMany({
            include: { _count: { select: { items: true } } },
            orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        });
    }
    async createCategory(dto) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.videoCatalogCategory.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Category "${dto.name}" already exists`);
        }
        return this.prisma.videoCatalogCategory.create({
            data: { name: dto.name, slug, displayOrder: dto.displayOrder !== undefined ? dto.displayOrder : 0 },
        });
    }
    async deleteCategory(id) {
        const c = await this.prisma.videoCatalogCategory.findUnique({ where: { id } });
        this.checkEntityExists(c, 'VideoCatalogCategory', id);
        await this.prisma.videoCatalogCategory.delete({ where: { id } });
        return { success: true };
    }
};
exports.VideoCatalogService = VideoCatalogService;
exports.VideoCatalogService = VideoCatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideoCatalogService);
//# sourceMappingURL=video-catalog.service.js.map
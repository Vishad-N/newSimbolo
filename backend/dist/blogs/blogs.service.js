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
exports.BlogsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let BlogsService = class BlogsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('BlogsService');
        this.prisma = prisma;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    calculateReadingTime(content) {
        const clean = content.replace(/<[^>]*>?/gm, '').trim();
        const wordCount = clean ? clean.split(/\s+/).length : 0;
        const wordsPerMin = 200;
        return Math.max(1, Math.ceil(wordCount / wordsPerMin));
    }
    async getBlogs(categoryId, tag, authorId, search, status) {
        const where = { deletedAt: null };
        if (status) {
            where.status = status;
        }
        else {
            where.status = client_1.BlogStatusEnum.PUBLISHED;
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (authorId) {
            where.authorId = authorId;
        }
        if (tag) {
            where.tags = { some: { slug: this.generateSlug(tag) } };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.blog.findMany({
            where,
            include: {
                author: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
                category: true,
                coverImage: true,
                tags: true,
            },
            orderBy: { publishDate: 'desc' },
        });
    }
    async getBlogBySlug(slug) {
        const blog = await this.prisma.blog.findUnique({
            where: { slug },
            include: {
                author: {
                    include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } } },
                },
                category: true,
                coverImage: true,
                tags: true,
            },
        });
        return this.checkEntityExists(blog, 'Blog', slug);
    }
    async createBlog(dto, createdBy) {
        const slug = this.generateSlug(dto.title);
        const existing = await this.prisma.blog.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Blog with title "${dto.title}" or slug "${slug}" already exists`);
        }
        const author = await this.prisma.blogAuthor.findUnique({ where: { id: dto.authorId } });
        this.checkEntityExists(author, 'BlogAuthor', dto.authorId);
        if (dto.categoryId) {
            const cat = await this.prisma.blogCategory.findUnique({ where: { id: dto.categoryId } });
            this.checkEntityExists(cat, 'BlogCategory', dto.categoryId);
        }
        const readingTimeMin = this.calculateReadingTime(dto.content);
        const status = dto.status || client_1.BlogStatusEnum.DRAFT;
        const publishDate = status === client_1.BlogStatusEnum.PUBLISHED ? new Date() : null;
        const tagConnections = [];
        if (dto.tags && dto.tags.length > 0) {
            for (const t of dto.tags) {
                const tagSlug = this.generateSlug(t);
                tagConnections.push({
                    where: { slug: tagSlug },
                    create: { name: t, slug: tagSlug },
                });
            }
        }
        const created = await this.prisma.blog.create({
            data: {
                title: dto.title,
                slug,
                excerpt: dto.excerpt || null,
                content: dto.content,
                status,
                publishDate,
                readingTimeMin,
                authorId: dto.authorId,
                coverImageId: dto.coverImageId || null,
                categoryId: dto.categoryId || null,
                createdBy: createdBy || null,
                tags: { connectOrCreate: tagConnections },
            },
            include: { author: true, category: true, tags: true },
        });
        this.logger.log(`Created blog "${created.title}" (ID: ${created.id}, status: ${status})`);
        return created;
    }
    async updateBlog(id, dto, updatedBy) {
        const blog = this.checkEntityExists(await this.prisma.blog.findUnique({ where: { id }, include: { tags: true } }), 'Blog', id);
        let slug = blog.slug;
        if (dto.title && dto.title !== blog.title) {
            slug = this.generateSlug(dto.title);
            const conflict = await this.prisma.blog.findFirst({ where: { slug, id: { not: id } } });
            if (conflict) {
                throw new custom_exceptions_1.CustomConflictException(`Blog title "${dto.title}" already exists`);
            }
        }
        const readingTimeMin = dto.content ? this.calculateReadingTime(dto.content) : blog.readingTimeMin;
        let publishDate = blog.publishDate;
        if (dto.status === client_1.BlogStatusEnum.PUBLISHED && blog.status !== client_1.BlogStatusEnum.PUBLISHED) {
            publishDate = new Date();
        }
        const tagUpdate = {};
        if (dto.tags) {
            const tagConnections = dto.tags.map((t) => {
                const tagSlug = this.generateSlug(t);
                return { where: { slug: tagSlug }, create: { name: t, slug: tagSlug } };
            });
            tagUpdate.set = [];
            tagUpdate.connectOrCreate = tagConnections;
        }
        return this.prisma.blog.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title, slug }),
                ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
                ...(dto.content !== undefined && { content: dto.content, readingTimeMin }),
                ...(dto.status !== undefined && { status: dto.status, publishDate }),
                ...(dto.authorId !== undefined && { authorId: dto.authorId }),
                ...(dto.coverImageId !== undefined && { coverImageId: dto.coverImageId }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                updatedBy: updatedBy || null,
                ...(dto.tags && { tags: tagUpdate }),
            },
            include: { author: true, category: true, tags: true },
        });
    }
    async deleteBlog(id, deletedBy) {
        const blog = await this.prisma.blog.findUnique({ where: { id } });
        this.checkEntityExists(blog, 'Blog', id);
        await this.prisma.blog.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy || null },
        });
        this.logger.log(`Soft-deleted blog ID: ${id}`);
        return { success: true };
    }
    // Categories
    async getCategories() {
        return this.prisma.blogCategory.findMany({
            where: { deletedAt: null },
            include: { _count: { select: { blogs: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(dto) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.blogCategory.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Category "${dto.name}" already exists`);
        }
        return this.prisma.blogCategory.create({
            data: { name: dto.name, slug, description: dto.description || null },
        });
    }
    async deleteCategory(id) {
        const cat = await this.prisma.blogCategory.findUnique({ where: { id } });
        this.checkEntityExists(cat, 'BlogCategory', id);
        await this.prisma.blogCategory.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { success: true };
    }
    // Tags
    async getTags() {
        return this.prisma.blogTag.findMany({
            include: { _count: { select: { blogs: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async createTag(dto) {
        const slug = this.generateSlug(dto.name);
        return this.prisma.blogTag.upsert({
            where: { slug },
            create: { name: dto.name, slug },
            update: { name: dto.name },
        });
    }
    async deleteTag(id) {
        const tag = await this.prisma.blogTag.findUnique({ where: { id } });
        this.checkEntityExists(tag, 'BlogTag', id);
        await this.prisma.blogTag.delete({ where: { id } });
        return { success: true };
    }
    // Authors
    async getAuthors() {
        return this.prisma.blogAuthor.findMany({
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
                _count: { select: { blogs: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createAuthor(dto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        this.checkEntityExists(user, 'User', dto.userId);
        return this.prisma.blogAuthor.upsert({
            where: { userId: dto.userId },
            create: {
                userId: dto.userId,
                bio: dto.bio || null,
                avatarUrl: dto.avatarUrl || null,
                twitterUrl: dto.twitterUrl || null,
                linkedinUrl: dto.linkedinUrl || null,
            },
            update: {
                ...(dto.bio !== undefined && { bio: dto.bio }),
                ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
                ...(dto.twitterUrl !== undefined && { twitterUrl: dto.twitterUrl }),
                ...(dto.linkedinUrl !== undefined && { linkedinUrl: dto.linkedinUrl }),
            },
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        });
    }
    async deleteAuthor(id) {
        const author = await this.prisma.blogAuthor.findUnique({ where: { id } });
        this.checkEntityExists(author, 'BlogAuthor', id);
        await this.prisma.blogAuthor.delete({ where: { id } });
        return { success: true };
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogsService);
//# sourceMappingURL=blogs.service.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blogs_service_1 = require("./blogs.service");
const create_blog_dto_1 = require("./dto/create-blog.dto");
const update_blog_dto_1 = require("./dto/update-blog.dto");
const create_blog_category_dto_1 = require("./dto/create-blog-category.dto");
const create_blog_tag_dto_1 = require("./dto/create-blog-tag.dto");
const create_blog_author_dto_1 = require("./dto/create-blog-author.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let BlogsController = class BlogsController {
    blogsService;
    constructor(blogsService) {
        this.blogsService = blogsService;
    }
    async getCategories() {
        return this.blogsService.getCategories();
    }
    async getTags() {
        return this.blogsService.getTags();
    }
    async getAuthors() {
        return this.blogsService.getAuthors();
    }
    async getBlogs(categoryId, tag, authorId, search, status) {
        return this.blogsService.getBlogs(categoryId, tag, authorId, search, status);
    }
    async getBlogBySlug(slug) {
        return this.blogsService.getBlogBySlug(slug);
    }
    async createBlog(dto, user) {
        return this.blogsService.createBlog(dto, user?.sub);
    }
    async updateBlog(id, dto, user) {
        return this.blogsService.updateBlog(id, dto, user?.sub);
    }
    async deleteBlog(id, user) {
        return this.blogsService.deleteBlog(id, user?.sub);
    }
    // Categories CRUD
    async createCategory(dto) {
        return this.blogsService.createCategory(dto);
    }
    async deleteCategory(id) {
        return this.blogsService.deleteCategory(id);
    }
    // Tags CRUD
    async createTag(dto) {
        return this.blogsService.createTag(dto);
    }
    async deleteTag(id) {
        return this.blogsService.deleteTag(id);
    }
    // Authors CRUD
    async createAuthor(dto) {
        return this.blogsService.createAuthor(dto);
    }
    async deleteAuthor(id) {
        return this.blogsService.deleteAuthor(id);
    }
};
exports.BlogsController = BlogsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blog taxonomy categories (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('tags'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blog topic tags (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tags returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getTags", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('authors'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attributed blog authors (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Authors returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getAuthors", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get blog articles with optional filtering (public defaults to PUBLISHED)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tag', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'authorId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.BlogStatusEnum, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blogs list returned' }),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('tag')),
    __param(2, (0, common_1.Query)('authorId')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBlogs", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single published article by slug with author and tags (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article returned' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBlogBySlug", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('blogs.create', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog article draft or published post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Article created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_dto_1.CreateBlogDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createBlog", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('blogs.update', 'content.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update blog article content, tags, or publish status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_dto_1.UpdateBlogDto, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "updateBlog", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('blogs.delete', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete a blog article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article deleted successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "deleteBlog", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('categories'),
    (0, permissions_decorator_1.Permissions)('blogs.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a blog category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_category_dto_1.CreateBlogCategoryDto]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('categories/:id'),
    (0, permissions_decorator_1.Permissions)('blogs.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a blog category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "deleteCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('tags'),
    (0, permissions_decorator_1.Permissions)('blogs.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a blog tag' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tag created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_tag_dto_1.CreateBlogTagDto]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createTag", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('tags/:id'),
    (0, permissions_decorator_1.Permissions)('blogs.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a blog tag' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tag deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "deleteTag", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('authors'),
    (0, permissions_decorator_1.Permissions)('blogs.manage', 'content.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Link a user account as an attributed blog author' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Author linked' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_author_dto_1.CreateBlogAuthorDto]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createAuthor", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('authors/:id'),
    (0, permissions_decorator_1.Permissions)('blogs.manage', 'content.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove author attribution profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Author removed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "deleteAuthor", null);
exports.BlogsController = BlogsController = __decorate([
    (0, swagger_1.ApiTags)('Marketing Blog & Articles CMS'),
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService])
], BlogsController);
//# sourceMappingURL=blogs.controller.js.map
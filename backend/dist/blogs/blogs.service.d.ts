import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogTagDto } from './dto/create-blog-tag.dto';
import { CreateBlogAuthorDto } from './dto/create-blog-author.dto';
import { Blog, BlogCategory, BlogTag, BlogAuthor, BlogStatusEnum } from '@prisma/client';
export declare class BlogsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    private calculateReadingTime;
    getBlogs(categoryId?: string, tag?: string, authorId?: string, search?: string, status?: BlogStatusEnum): Promise<Blog[]>;
    getBlogBySlug(slug: string): Promise<Blog>;
    createBlog(dto: CreateBlogDto, createdBy?: string): Promise<Blog>;
    updateBlog(id: string, dto: UpdateBlogDto, updatedBy?: string): Promise<Blog>;
    deleteBlog(id: string, deletedBy?: string): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<BlogCategory[]>;
    createCategory(dto: CreateBlogCategoryDto): Promise<BlogCategory>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    getTags(): Promise<BlogTag[]>;
    createTag(dto: CreateBlogTagDto): Promise<BlogTag>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
    getAuthors(): Promise<BlogAuthor[]>;
    createAuthor(dto: CreateBlogAuthorDto): Promise<BlogAuthor>;
    deleteAuthor(id: string): Promise<{
        success: boolean;
    }>;
}

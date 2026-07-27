import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogTagDto } from './dto/create-blog-tag.dto';
import { CreateBlogAuthorDto } from './dto/create-blog-author.dto';
import { BlogStatusEnum } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class BlogsController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    getCategories(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        slug: string;
    }[]>;
    getTags(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }[]>;
    getAuthors(): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        avatarUrl: string | null;
        updatedAt: Date;
        bio: string | null;
        twitterUrl: string | null;
        linkedinUrl: string | null;
    }[]>;
    getBlogs(categoryId?: string, tag?: string, authorId?: string, search?: string, status?: BlogStatusEnum): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BlogStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        title: string;
        slug: string;
        content: string;
        categoryId: string | null;
        seoPageId: string | null;
        excerpt: string | null;
        authorId: string;
        coverImageId: string | null;
        publishDate: Date | null;
        readingTimeMin: number;
    }[]>;
    getBlogBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BlogStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        title: string;
        slug: string;
        content: string;
        categoryId: string | null;
        seoPageId: string | null;
        excerpt: string | null;
        authorId: string;
        coverImageId: string | null;
        publishDate: Date | null;
        readingTimeMin: number;
    }>;
    createBlog(dto: CreateBlogDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BlogStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        title: string;
        slug: string;
        content: string;
        categoryId: string | null;
        seoPageId: string | null;
        excerpt: string | null;
        authorId: string;
        coverImageId: string | null;
        publishDate: Date | null;
        readingTimeMin: number;
    }>;
    updateBlog(id: string, dto: UpdateBlogDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BlogStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
        createdBy: string | null;
        updatedBy: string | null;
        title: string;
        slug: string;
        content: string;
        categoryId: string | null;
        seoPageId: string | null;
        excerpt: string | null;
        authorId: string;
        coverImageId: string | null;
        publishDate: Date | null;
        readingTimeMin: number;
    }>;
    deleteBlog(id: string, user: JwtPayload): Promise<{
        success: boolean;
    }>;
    createCategory(dto: CreateBlogCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        slug: string;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    createTag(dto: CreateBlogTagDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
    createAuthor(dto: CreateBlogAuthorDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        avatarUrl: string | null;
        updatedAt: Date;
        bio: string | null;
        twitterUrl: string | null;
        linkedinUrl: string | null;
    }>;
    deleteAuthor(id: string): Promise<{
        success: boolean;
    }>;
}

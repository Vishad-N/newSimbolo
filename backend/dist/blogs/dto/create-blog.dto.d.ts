import { BlogStatusEnum } from '@prisma/client';
export declare class CreateBlogDto {
    title: string;
    excerpt?: string;
    content: string;
    status?: BlogStatusEnum;
    authorId: string;
    coverImageId?: string | null;
    categoryId?: string | null;
    tags?: string[];
}

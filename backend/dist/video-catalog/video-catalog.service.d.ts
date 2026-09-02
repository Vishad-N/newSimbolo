import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoCatalogItemDto } from './dto/create-video-catalog-item.dto';
import { UpdateVideoCatalogItemDto } from './dto/update-video-catalog-item.dto';
import { CreateVideoCatalogCategoryDto } from './dto/create-video-catalog-category.dto';
import { VideoCatalogItem, VideoCatalogCategory, VideoCatalogStatusEnum } from '@prisma/client';
export declare class VideoCatalogService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    getItems(categoryId?: string, search?: string, status?: VideoCatalogStatusEnum | 'ALL'): Promise<VideoCatalogItem[]>;
    getItemBySlug(slug: string): Promise<VideoCatalogItem>;
    createItem(dto: CreateVideoCatalogItemDto, createdBy?: string): Promise<VideoCatalogItem>;
    updateItem(id: string, dto: UpdateVideoCatalogItemDto, updatedBy?: string): Promise<VideoCatalogItem>;
    deleteItem(id: string, deletedBy?: string): Promise<{
        success: boolean;
    }>;
    reorderItems(orderedIds: string[]): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<VideoCatalogCategory[]>;
    createCategory(dto: CreateVideoCatalogCategoryDto): Promise<VideoCatalogCategory>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
}

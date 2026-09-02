-- CreateEnum
CREATE TYPE "VideoPreviewTypeEnum" AS ENUM ('YOUTUBE', 'INSTAGRAM', 'VIMEO', 'DIRECT');

-- CreateEnum
CREATE TYPE "VideoCatalogComplexityEnum" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EXPERT');

-- CreateEnum
CREATE TYPE "VideoCatalogStatusEnum" AS ENUM ('PUBLISHED', 'HIDDEN', 'ARCHIVED');

-- CreateTable
CREATE TABLE "video_catalog_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_catalog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_catalog_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "previewType" "VideoPreviewTypeEnum" NOT NULL DEFAULT 'YOUTUBE',
    "previewUrl" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT,
    "hourlyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "estimatedDelivery" TEXT,
    "recommendedDuration" TEXT,
    "complexity" "VideoCatalogComplexityEnum" NOT NULL DEFAULT 'MEDIUM',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "badge" TEXT,
    "status" "VideoCatalogStatusEnum" NOT NULL DEFAULT 'PUBLISHED',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "video_catalog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VideoCatalogCategoryToVideoCatalogItem" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_VideoCatalogCategoryToVideoCatalogItem_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_catalog_categories_name_key" ON "video_catalog_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "video_catalog_categories_slug_key" ON "video_catalog_categories"("slug");

-- CreateIndex
CREATE INDEX "video_catalog_categories_slug_idx" ON "video_catalog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "video_catalog_items_slug_key" ON "video_catalog_items"("slug");

-- CreateIndex
CREATE INDEX "video_catalog_items_slug_idx" ON "video_catalog_items"("slug");

-- CreateIndex
CREATE INDEX "video_catalog_items_status_idx" ON "video_catalog_items"("status");

-- CreateIndex
CREATE INDEX "_VideoCatalogCategoryToVideoCatalogItem_B_index" ON "_VideoCatalogCategoryToVideoCatalogItem"("B");

-- AddForeignKey
ALTER TABLE "_VideoCatalogCategoryToVideoCatalogItem" ADD CONSTRAINT "_VideoCatalogCategoryToVideoCatalogItem_A_fkey" FOREIGN KEY ("A") REFERENCES "video_catalog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoCatalogCategoryToVideoCatalogItem" ADD CONSTRAINT "_VideoCatalogCategoryToVideoCatalogItem_B_fkey" FOREIGN KEY ("B") REFERENCES "video_catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: add simple text-based before/after stat fields, and make the image
-- fields optional since a "transformation" row can now be text-only.
ALTER TABLE "before_after_comparisons" ADD COLUMN "metric" TEXT;
ALTER TABLE "before_after_comparisons" ADD COLUMN "beforeValue" TEXT;
ALTER TABLE "before_after_comparisons" ADD COLUMN "afterValue" TEXT;
ALTER TABLE "before_after_comparisons" ALTER COLUMN "beforeImageId" DROP NOT NULL;
ALTER TABLE "before_after_comparisons" ALTER COLUMN "afterImageId" DROP NOT NULL;

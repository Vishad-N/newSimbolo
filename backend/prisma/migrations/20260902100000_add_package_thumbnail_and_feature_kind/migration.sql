-- CreateEnum
CREATE TYPE "PackageFeatureKindEnum" AS ENUM ('FEATURE', 'DELIVERABLE');

-- AlterTable
ALTER TABLE "packages" ADD COLUMN "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "package_features" ADD COLUMN "kind" "PackageFeatureKindEnum" NOT NULL DEFAULT 'FEATURE';

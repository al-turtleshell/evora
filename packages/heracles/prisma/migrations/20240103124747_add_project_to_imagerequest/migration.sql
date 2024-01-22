-- CreateEnum
CREATE TYPE "ImageRequestProject" AS ENUM ('instagram', 'adobe_stock', 'youtube_short');

-- AlterTable
ALTER TABLE "ImageRequest" ADD COLUMN     "project" "ImageRequestProject" NOT NULL DEFAULT 'adobe_stock';

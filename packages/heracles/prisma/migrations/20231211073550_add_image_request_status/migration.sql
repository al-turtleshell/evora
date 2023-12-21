-- CreateEnum
CREATE TYPE "ImageRequestStatus" AS ENUM ('pending', 'in_progress', 'to_review', 'completed');

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "status" SET DEFAULT 'generated';

-- AlterTable
ALTER TABLE "ImageRequest" ADD COLUMN     "status" "ImageRequestStatus" NOT NULL DEFAULT 'pending';

-- CreateEnum
CREATE TYPE "ImageStyle" AS ENUM ('black_and_white_illustration');

-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('generated', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "ImageRequest" (
    "id" TEXT NOT NULL,
    "numberOfImages" INTEGER NOT NULL,
    "style" "ImageStyle" NOT NULL,
    "description" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "ImageRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "status" "ImageStatus" NOT NULL,
    "imageRequestId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_imageRequestId_fkey" FOREIGN KEY ("imageRequestId") REFERENCES "ImageRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "MidjourneyChannel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "busy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MidjourneyChannel_pkey" PRIMARY KEY ("id")
);

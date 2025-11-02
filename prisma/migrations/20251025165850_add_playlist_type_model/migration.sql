-- AlterTable
ALTER TABLE "public"."Playlist" ADD COLUMN     "playlistTypeId" TEXT;

-- CreateTable
CREATE TABLE "public"."PlaylistType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistType_name_key" ON "public"."PlaylistType"("name");

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_playlistTypeId_fkey" FOREIGN KEY ("playlistTypeId") REFERENCES "public"."PlaylistType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

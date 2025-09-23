/*
  Warnings:

  - A unique constraint covering the columns `[youtubePlaylistId,source]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Playlist_youtubePlaylistId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_youtubePlaylistId_source_key" ON "public"."Playlist"("youtubePlaylistId", "source");

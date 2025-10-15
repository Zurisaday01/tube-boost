-- DropForeignKey
ALTER TABLE "public"."PlaylistVideo" DROP CONSTRAINT "PlaylistVideo_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlaylistVideoNote" DROP CONSTRAINT "PlaylistVideoNote_playlistVideoId_fkey";

-- AddForeignKey
ALTER TABLE "public"."PlaylistVideo" ADD CONSTRAINT "PlaylistVideo_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistVideoNote" ADD CONSTRAINT "PlaylistVideoNote_playlistVideoId_fkey" FOREIGN KEY ("playlistVideoId") REFERENCES "public"."PlaylistVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "public"."VideoTag" DROP CONSTRAINT "VideoTag_playlistVideoId_fkey";

-- AddForeignKey
ALTER TABLE "public"."VideoTag" ADD CONSTRAINT "VideoTag_playlistVideoId_fkey" FOREIGN KEY ("playlistVideoId") REFERENCES "public"."PlaylistVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

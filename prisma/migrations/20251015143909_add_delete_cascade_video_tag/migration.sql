-- DropForeignKey
ALTER TABLE "public"."VideoTag" DROP CONSTRAINT "VideoTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VideoTag" DROP CONSTRAINT "VideoTag_videoId_fkey";

-- AddForeignKey
ALTER TABLE "public"."VideoTag" ADD CONSTRAINT "VideoTag_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoTag" ADD CONSTRAINT "VideoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

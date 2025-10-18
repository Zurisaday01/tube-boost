/*
  Warnings:

  - The primary key for the `VideoTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `playlistVideoId` on table `VideoTag` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."VideoTag" DROP CONSTRAINT "VideoTag_playlistVideoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VideoTag" DROP CONSTRAINT "VideoTag_videoId_fkey";

-- AlterTable
ALTER TABLE "public"."VideoTag" DROP CONSTRAINT "VideoTag_pkey",
ALTER COLUMN "playlistVideoId" SET NOT NULL,
ADD CONSTRAINT "VideoTag_pkey" PRIMARY KEY ("playlistVideoId", "tagId");

-- AddForeignKey
ALTER TABLE "public"."VideoTag" ADD CONSTRAINT "VideoTag_playlistVideoId_fkey" FOREIGN KEY ("playlistVideoId") REFERENCES "public"."PlaylistVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

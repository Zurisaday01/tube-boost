/*
  Warnings:

  - You are about to drop the column `grade` on the `ChannelRule` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `ChannelRule` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `VideoMetadata` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,groupId,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Made the column `color` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."Tag_name_key";

-- AlterTable
ALTER TABLE "public"."ChannelRule" DROP COLUMN "grade",
DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "public"."Tag" ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "color" SET DEFAULT '#000000';

-- AlterTable
ALTER TABLE "public"."VideoMetadata" DROP COLUMN "grade";

-- DropEnum
DROP TYPE "public"."Grade";

-- CreateTable
CREATE TABLE "public"."TagGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TagGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VideoTag" (
    "videoId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "playlistVideoId" TEXT,

    CONSTRAINT "VideoTag_pkey" PRIMARY KEY ("videoId","tagId")
);

-- CreateTable
CREATE TABLE "public"."_ChannelRuleToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChannelRuleToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TagGroup_name_userId_key" ON "public"."TagGroup"("name", "userId");

-- CreateIndex
CREATE INDEX "_ChannelRuleToTag_B_index" ON "public"."_ChannelRuleToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_groupId_userId_key" ON "public"."Tag"("name", "groupId", "userId");

-- AddForeignKey
ALTER TABLE "public"."TagGroup" ADD CONSTRAINT "TagGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."TagGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoTag" ADD CONSTRAINT "VideoTag_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoTag" ADD CONSTRAINT "VideoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoTag" ADD CONSTRAINT "VideoTag_playlistVideoId_fkey" FOREIGN KEY ("playlistVideoId") REFERENCES "public"."PlaylistVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ChannelRuleToTag" ADD CONSTRAINT "_ChannelRuleToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ChannelRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ChannelRuleToTag" ADD CONSTRAINT "_ChannelRuleToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

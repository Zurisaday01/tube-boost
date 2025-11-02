/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `PlaylistType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."PlaylistType_name_key";

-- CreateIndex
CREATE INDEX "PlaylistType_userId_createdAt_idx" ON "public"."PlaylistType"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistType_name_userId_key" ON "public"."PlaylistType"("name", "userId");

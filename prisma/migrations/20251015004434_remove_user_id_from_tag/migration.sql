/*
  Warnings:

  - You are about to drop the column `userId` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,groupId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- DropIndex
DROP INDEX "public"."Tag_name_groupId_userId_key";

-- AlterTable
ALTER TABLE "public"."Tag" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_groupId_key" ON "public"."Tag"("name", "groupId");

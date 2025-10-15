-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_groupId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."TagGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

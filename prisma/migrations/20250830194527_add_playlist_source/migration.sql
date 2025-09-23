-- CreateEnum
CREATE TYPE "public"."PlaylistSource" AS ENUM ('YOUTUBE', 'MANUAL');

-- AlterTable
ALTER TABLE "public"."Playlist" ADD COLUMN     "source" "public"."PlaylistSource" NOT NULL DEFAULT 'MANUAL',
ALTER COLUMN "youtubePlaylistId" DROP NOT NULL;

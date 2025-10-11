-- CreateTable
CREATE TABLE "public"."PlaylistVideoNote" (
    "id" TEXT NOT NULL,
    "playlistVideoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "document" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistVideoNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistVideoNote_playlistVideoId_key" ON "public"."PlaylistVideoNote"("playlistVideoId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistVideoNote_userId_key" ON "public"."PlaylistVideoNote"("userId");

-- AddForeignKey
ALTER TABLE "public"."PlaylistVideoNote" ADD CONSTRAINT "PlaylistVideoNote_playlistVideoId_fkey" FOREIGN KEY ("playlistVideoId") REFERENCES "public"."PlaylistVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistVideoNote" ADD CONSTRAINT "PlaylistVideoNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

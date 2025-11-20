'use server';

import { prisma } from '../db/prisma';

export async function searchVideosAndPlaylists(query: string) {
  if (!query.trim()) return [];

  // 1. Search videos in playlists
  const playlistVideos = await prisma.playlistVideo.findMany({
    where: {
      OR: [
        { video: { title: { contains: query, mode: 'insensitive' } } },
        { playlist: { title: { contains: query, mode: 'insensitive' } } },
        { note: { searchableText: { contains: query, mode: 'insensitive' } } }
      ]
    },
    include: { video: true, playlist: true, note: true },
    take: 20
  });



  // 2. Search playlists directly (standalone playlists matching the query)
  const playlists = await prisma.playlist.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' }
    },
    take: 20
  });

  // 3. Return a merged result
  return {
    playlistVideos,
    playlists
  };
}

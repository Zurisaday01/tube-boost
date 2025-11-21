'use server';

import { prisma } from '../db/prisma';
import { getSessionUser, isUserAuthenticated } from '../utils/actions';

export async function searchVideosAndPlaylists(query: string) {
  const user = await getSessionUser();
  if (!isUserAuthenticated(user)) {
    throw new Error('User not authenticated');
  }

  if (!query.trim()) {
    return { playlistVideos: [], playlists: [] };
  }

  // 1. Search videos in playlists
  const playlistVideos = await prisma.playlistVideo.findMany({
    where: {
      playlist: {
        userId: user.userId // Ensure we only search user's own playlists
      },
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

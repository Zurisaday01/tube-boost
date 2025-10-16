'use server';

import { z } from 'zod';
import { createPlaylistSchema } from '@/lib/schemas';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { devLog } from '@/lib/utils';
import { getSessionUser, isUserAuthenticated } from '@/lib/utils/actions';
import { ActionResponse, PlaylistWithStats } from '@/types/actions';
import { Playlist } from '@prisma/client';

export const createPlaylist = async (
  data: z.infer<typeof createPlaylistSchema>
): Promise<ActionResponse<Playlist>> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }
    // Validate server side
    const parsed = createPlaylistSchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    // Destructure the parsed data
    const { title } = parsed.data;

    // Create playlist
    const playlist = await prisma.playlist.create({
      data: {
        title,
        userId: user.userId,
        source: 'MANUAL'
      }
    });

    revalidatePath('/dashboard/playlists');

    return {
      status: 'success',
      message: `'${playlist.title}' playlist created successfully!`,
      data: playlist
    };
  } catch (error) {
    devLog.error('Error creating playlist:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to create playlist.'
    };
  }
};

export const getAllPlaylists = async (): Promise<
  ActionResponse<PlaylistWithStats[]>
> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated');
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.userId },
      select: {
        id: true,
        title: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            videos: true, // videos directly in playlist
            subcategories: true // number of categories
          }
        },
        subcategories: {
          select: {
            _count: { select: { videos: true } } // videos per subcategory
          }
        }
      }
    });

    const playlistsWithStats = playlists.map((playlist) => {
      const totalVideosInSubcategories = playlist.subcategories.reduce(
        (acc, sub) => acc + sub._count.videos,
        0
      );
      const totalVideos = playlist._count.videos + totalVideosInSubcategories;

      return {
        id: playlist.id,
        title: playlist.title,
        source: playlist.source,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
        totalCategories: playlist._count.subcategories,
        totalVideos
      };
    });

    return {
      status: 'success',
      message: 'Playlists fetched successfully.',
      data: playlistsWithStats
    };
  } catch (error) {
    devLog.error('Error fetching playlists:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch playlists.'
    };
  }
};

export const getPlaylistById = async (
  id: string
): Promise<ActionResponse<PlaylistWithStats>> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated');
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id, userId: user.userId },
      select: {
        id: true,
        title: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            videos: true,
            subcategories: true
          }
        },
        subcategories: {
          select: {
            _count: { select: { videos: true } }
          }
        }
      }
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const playlistWithStats: PlaylistWithStats = {
      id: playlist.id,
      title: playlist.title,
      source: playlist.source,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
      totalCategories: playlist._count.subcategories,
      totalVideos: playlist._count.videos // TODO: Review how the logic is handling this since 1 video is getting counted twice
    };

    return {
      status: 'success',
      message: 'Playlist fetched successfully.',
      data: playlistWithStats
    };
  } catch (error) {
    devLog.error('Error fetching playlist:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch playlist.'
    };
  }
};

// Delete a playlist and all its associated playlist videos. If any videos become orphaned (not referenced in any other playlist), delete those videos as well
export const deletePlaylist = async (
  playlistId: string
): Promise<ActionResponse> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    // Fetch playlist with videos
    const playlist = await prisma.playlist.findFirst({
      where: { id: playlistId, userId: user.userId },
      include: { videos: { select: { videoId: true } } }
    });

    if (!playlist) {
      throw new Error('Playlist not found or unauthorized.');
    }

    // Start transaction: delete playlist and playlist videos
    await prisma.$transaction(async (tx) => {
      // Delete the playlist (this cascades PlaylistVideos via schema)
      await tx.playlist.delete({ where: { id: playlistId } });

      // Collect all videoIds from deleted playlist videos
      const videoIds = playlist.videos.map((pv) => pv.videoId);

      if (videoIds.length > 0) {
        // Find orphaned videos (videos with no remaining PlaylistVideos)
        const orphanedVideos = await tx.video.findMany({
          where: { id: { in: videoIds }, playlistVideos: { none: {} } }
        });

        if (orphanedVideos.length > 0) {
          await tx.video.deleteMany({
            where: { id: { in: orphanedVideos.map((v) => v.id) } }
          });
        }
      }
    });

    revalidatePath('/dashboard/playlists');

    return { status: 'success', message: 'Playlist deleted successfully.' };
  } catch (err) {
    devLog.error('Error deleting playlist:', err);
    return {
      status: 'error',
      message: (err as Error).message || 'Failed to delete playlist.'
    };
  }
};

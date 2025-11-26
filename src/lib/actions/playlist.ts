'use server';

import { z } from 'zod';
import { createUpdatePlaylistSchema } from '@/lib/schemas';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { devLog } from '@/lib/utils';
import {
  getSessionUser,
  isUserAuthenticated,
  mapToPlaylistWithStats,
  parseVideoThumbnails
} from '@/lib/utils/actions';
import {
  ActionResponse,
  PlaylistWithStats,
  PlaylistWithStatsAndUncategorizedVideos
} from '@/types/actions';
import { Playlist } from '@prisma/client';

export const createPlaylist = async (
  data: z.infer<typeof createUpdatePlaylistSchema>
): Promise<ActionResponse<Playlist>> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }
    // Validate server side
    const parsed = createUpdatePlaylistSchema.safeParse(data);

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

export const updatePlaylistTitle = async (
  data: z.infer<typeof createUpdatePlaylistSchema>,
  id: string
): Promise<ActionResponse<Playlist>> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    // Validate server side
    const parsed = createUpdatePlaylistSchema.safeParse(data);
    if (!parsed.success) throw new Error('Validation was not successful.');

    const { title } = parsed.data;

    // Update playlist (returns a list of the updated playlists - should be only one)
    const playlist = await prisma.playlist.updateManyAndReturn({
      where: { id, userId: user.userId },
      data: { title }
    });

    if (playlist.length === 0)
      throw new Error('Playlist not found or unauthorized.');

    const [updatedPlaylist] = playlist;

    if (!updatedPlaylist)
      throw new Error('Unexpected error fetching updated playlist.');

    revalidatePath(`/dashboard/playlists/${updatedPlaylist.id}`);

    return {
      status: 'success',
      message: `'${updatedPlaylist.title}' playlist title updated successfully!`,
      data: updatedPlaylist
    };
  } catch (error) {
    devLog.error('Error updating playlist title:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to update playlist title.'
    };
  }
};

interface GetAllPlaylistsParams {
  playlistTypeId?: string;
  page?: number;
  pageSize?: number;
}

export const getAllPlaylists = async ({
  playlistTypeId,
  page = 1,
  pageSize = 10
}: GetAllPlaylistsParams): Promise<
  ActionResponse<{ items: PlaylistWithStats[]; total: number }>
> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated');
    }

    // Validate pagination params
    const validPage = Math.max(1, Math.floor(page));
    const validPageSize = Math.max(1, Math.min(100, Math.floor(pageSize)));

    const where = {
      userId: user.userId,
      ...(playlistTypeId ? { playlistTypeId } : {})
    };

    // Pagination calculations
    const skip = (validPage - 1) * validPageSize;

    // Fetch page data + total count in parallel
    const [playlists, total] = await Promise.all([
      prisma.playlist.findMany({
        where,
        skip,
        take: validPageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          source: true,
          createdAt: true,
          updatedAt: true,
          playlistType: true,
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
      }),

      prisma.playlist.count({ where })
    ]);

    const playlistsWithStats = mapToPlaylistWithStats(playlists);

    return {
      status: 'success',
      message: 'Playlists fetched successfully.',
      data: {
        items: playlistsWithStats,
        total
      }
    };
  } catch (error) {
    devLog.error('Error fetching playlists:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch playlists.'
    };
  }
};

// Get playlist by ID along with stats and the uncategorized videos payload
export const getPlaylistById = async (
  id: string
): Promise<ActionResponse<PlaylistWithStatsAndUncategorizedVideos>> => {
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
        playlistType: true,
        videos: {
          // include the playlist videos
          include: { video: true }
        },
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

    // Group the uncategorized videos (subcategoryId is null)
    const uncategorizedVideos = playlist.videos.filter(
      (v) => v.subcategoryId === null
    );

    const playlistWithStats: PlaylistWithStatsAndUncategorizedVideos = {
      id: playlist.id,
      title: playlist.title,
      source: playlist.source,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
      totalCategories: playlist._count.subcategories,
      playlistType: playlist.playlistType,
      totalVideos: playlist._count.videos, // TODO: Review how the logic is handling this since 1 video is getting counted twice
      uncategorizedPlaylistVideos:
        uncategorizedVideos?.map((pv) => ({
          ...pv,
          video: parseVideoThumbnails(pv.video) // Parse thumbnails JSON
        })) || []
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
  playlistId: string,
  playlistTitle: string // For better user feedback
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

    return {
      status: 'success',
      message: `Playlist '${playlistTitle}' deleted successfully.`
    };
  } catch (err) {
    devLog.error('Error deleting playlist:', err);
    return {
      status: 'error',
      message:
        (err as Error).message ||
        `Failed to delete playlist '${playlistTitle}'.`
    };
  }
};

'use server';
import { z } from 'zod';
import {
  assignUpdatePlaylistTypeSchema,
  createUpdatePlaylistTypeSchema
} from '@/lib/schemas';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { devLog } from '@/lib/utils';
import { cache } from 'react';
import {
  getSessionUser,
  isUserAuthenticated,
  mapToPlaylistWithStats
} from '@/lib/utils/actions';

import {
  ActionResponse,
  DeleteActionResponse,
  PlaylistWithStats
} from '@/types/actions';
import type { PlaylistType } from '@prisma/client';
import { PlaylistTypeOptions } from '@/types';

interface GetPlaylistCountByPlaylistTypeParams {
  id: string;
  page?: number;
  pageSize?: number;
}

export const getPlaylistCountByPlaylistType = async ({
  id,
  page = 1,
  pageSize = 10
}: GetPlaylistCountByPlaylistTypeParams): Promise<
  ActionResponse<{
    playlistType: any;
    count: number;
    playlists: { items: PlaylistWithStats[]; total: number};
  }>
> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    // Get playlist type (for metadata, name, etc.)
    const playlistType = await prisma.playlistType.findFirst({
      where: { id, userId: user.userId }
    });

    if (!playlistType) {
      throw new Error('Playlist type not found.');
    }

    // Validate pagination params
    const validPage = Math.max(1, Math.floor(page));
    const validPageSize = Math.max(1, Math.min(100, Math.floor(pageSize)));
    // Pagination calculations
    const skip = (validPage - 1) * validPageSize;

    // Get playlists of this type, with the *same select* as getAllPlaylists
    // Fetch page data + total count in parallel
    const [playlists, total] = await Promise.all([
      await prisma.playlist.findMany({
        where: {
          userId: user.userId,
          playlistTypeId: id
        },
        skip,
        take: validPageSize,
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

      // Get total count of playlists of this type
      prisma.playlist.count({
        where: {
          userId: user.userId,
          playlistTypeId: id
        }
      })
    ]);

    // Compute stats same as getAllPlaylists
    const playlistsWithStats = mapToPlaylistWithStats(playlists);

    const count = playlistsWithStats.length;

    return {
      status: 'success',
      message: 'Playlist type, playlists, and count fetched successfully.',
      data: {
        playlistType,
        count,
        playlists: {
          items: playlistsWithStats,
          total
        }
      }
    };
  } catch (error) {
    devLog.error('Error fetching playlist type and stats:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch playlist type info.'
    };
  }
};

export const createPlaylistType = async (
  data: z.infer<typeof createUpdatePlaylistTypeSchema>
): Promise<ActionResponse<PlaylistType>> => {
  try {
    // Ensure user is authenticated
    const user = await getSessionUser();

    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }
    // Validate server side
    const parsed = createUpdatePlaylistTypeSchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    const { name, description } = parsed.data;

    // Create the playlist type
    const playlistType = await prisma.playlistType.create({
      data: {
        name,
        description,
        userId: user.userId // Associate with the logged-in user
      }
    });

    // Revalidate the path where the playlist types are displayed.
    revalidatePath('/dashboard/playlist-types');
    revalidatePath(`/dashboard/playlist-types/${playlistType.id}`);

    return {
      status: 'success',
      message: `'${playlistType.name}' created successfully!`,
      data: playlistType
    };
  } catch (error) {
    devLog.error('Error creating playlist type:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to create playlist type.'
    };
  }
};

export const updatePlaylistTypeColor = async (
  id: string,
  color: string,
  name: string // for error messages only
): Promise<ActionResponse<PlaylistType>> => {
  try {
    // Ensure user is authenticated
    const user = await getSessionUser();

    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    // Update playlist type color
    const playlistType = await prisma.playlistType.updateManyAndReturn({
      where: { id, userId: user.userId },
      data: { color }
    });

    if (playlistType.length === 0) {
      throw new Error('Playlist type not found.');
    }

    const [updatedPlaylistType] = playlistType;

    // Revalidate the path where the playlist types are displayed.
    revalidatePath('/dashboard/playlist-types');
    revalidatePath(`/dashboard/playlist-types/${updatedPlaylistType.id}`);

    return {
      status: 'success',
      message: `Color updated to ${color} for '${updatedPlaylistType.name}' playlist type`,
      data: updatedPlaylistType
    };
  } catch (error) {
    devLog.error('Error updating playlist type color:', error);
    return {
      status: 'error',
      message:
        (error as Error).message ||
        `Failed to update color for '${name}' playlist type.`
    };
  }
};

export const updatePlaylistType = async (
  playlistTypeId: string,
  data: z.infer<typeof createUpdatePlaylistTypeSchema>
): Promise<ActionResponse<PlaylistType>> => {
  try {
    const user = await getSessionUser();

    if (!isUserAuthenticated(user)) {
      throw new Error('You must be logged in to update a playlist type.');
    }

    // Validate server side
    const parsed = createUpdatePlaylistTypeSchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    const { name, description } = parsed.data;

    // Update the playlist type
    const result = await prisma.playlistType.updateMany({
      where: {
        id: playlistTypeId,
        userId: user.userId // Ensure the user owns the playlist type
      },
      data: {
        name,
        description
      }
    });

    if (result.count === 0) {
      throw new Error('Playlist type not found.');
    }

    // Revalidate the path where the playlist types are displayed.
    revalidatePath('/dashboard/playlist-types');
    revalidatePath(`/dashboard/playlist-types/${playlistTypeId}`);

    return {
      status: 'success',
      message: `'${name}' updated successfully!`
    };
  } catch (error) {
    devLog.error('Error updating playlist type:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to update playlist type.'
    };
  }
};

// Use void return type since no data is needed, only success/error message
export const assignUpdatePlaylistType = async (
  data: z.infer<typeof assignUpdatePlaylistTypeSchema>,
  playlistId: string,
  actionType: 'Assign' | 'Update'
): Promise<ActionResponse<void>> => {
  // Determine past tense for messages
  const actionTypePastTense = actionType === 'Assign' ? 'assigned' : 'updated';

  try {
    const user = await getSessionUser();

    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    // Validate server side
    const parsed = assignUpdatePlaylistTypeSchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    const { playlistTypeId } = parsed.data;

    // Update the playlist with the new playlist type
    await prisma.playlist.update({
      where: {
        id: playlistId,
        userId: user.userId
      },
      data: {
        playlistTypeId
      }
    });

    // Revalidate the path where the playlists are displayed.
    revalidatePath('/dashboard/playlists');
    revalidatePath(`/dashboard/playlists/${playlistId}`);

    return {
      status: 'success',
      message: `Playlist type ${actionTypePastTense} successfully!`
    };
  } catch (error) {
    devLog.error('Error assigning/updating playlist type:', error);
    return {
      status: 'error',
      message:
        (error as Error).message ||
        `Failed to ${actionTypePastTense} playlist type.`
    };
  }
};
// for the select dropdown
export const getAllPlaylistTypesOptions = cache(
  async (): Promise<ActionResponse<PlaylistTypeOptions[]>> => {
    try {
      const user = await getSessionUser();
      if (!isUserAuthenticated(user)) {
        throw new Error('User not authenticated.');
      }

      const playlistTypes = await prisma.playlistType.findMany({
        where: { userId: user.userId },
        include: {
          playlists: true
        },
        orderBy: { createdAt: 'asc' }
      });

      // I need {value: id, label: name} format for the select options
      const options = playlistTypes.map((type) => ({
        value: type.id,
        label: type.name
      }));

      return {
        status: 'success',
        message: 'Playlist types fetched successfully.',
        data: options
      };
    } catch (error) {
      devLog.error('Error fetching playlist types:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Failed to fetch playlist types.'
      };
    }
  }
);

export const getAllPlaylistTypes = cache(
  async (): Promise<ActionResponse<PlaylistType[]>> => {
    try {
      const user = await getSessionUser();
      if (!isUserAuthenticated(user)) {
        throw new Error('User not authenticated.');
      }

      const playlistTypes = await prisma.playlistType.findMany({
        where: { userId: user.userId },
        include: {
          playlists: true
        },
        orderBy: { createdAt: 'asc' }
      });

      return {
        status: 'success',
        message: 'Playlist types fetched successfully.',
        data: playlistTypes
      };
    } catch (error) {
      devLog.error('Error fetching playlist types:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Failed to fetch playlist types.'
      };
    }
  }
);

export const getPlaylistTypeById = async (
  id: string
): Promise<ActionResponse<PlaylistType>> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    const playlistType = await prisma.playlistType.findFirst({
      where: { id, userId: user.userId }
    });

    if (!playlistType) {
      throw new Error('Playlist type not found.');
    }

    return {
      status: 'success',
      message: 'Playlist type fetched successfully.',
      data: playlistType
    };
  } catch (error) {
    devLog.error('Error fetching playlist type:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch playlist type.'
    };
  }
};

export const deletePlaylistType = async (
  id: string
): Promise<DeleteActionResponse> => {
  try {
    const user = await getSessionUser();

    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    // Delete the playlist type
    const deletedPlaylistType = await prisma.playlistType.delete({
      where: { id, userId: user.userId }
    });

    // Revalidate the path where the playlist types are displayed.
    revalidatePath('/dashboard/playlist-types');

    return {
      status: 'success',
      message: `Playlist type '${deletedPlaylistType.name}' deleted successfully.`
    };
  } catch (error) {
    devLog.error('Error deleting playlist type:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to delete playlist type.'
    };
  }
};

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
import { getSessionUser, isUserAuthenticated } from '@/lib/utils/actions';

import { ActionResponse, DeleteActionResponse } from '@/types/actions';
import type { PlaylistType } from '@prisma/client';
import { PlaylistTypeOptions } from '@/types';

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
    const playlistType = await prisma.playlistType.update({
      where: { id },
      data: { color }
    });

    // Revalidate the path where the playlist types are displayed.
    revalidatePath('/dashboard/playlist-types');
    revalidatePath(`/dashboard/playlist-types/${playlistType.id}`);

    return {
      status: 'success',
      message: `Color updated to ${color} for '${playlistType.name}' playlist type`,
      data: playlistType
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

export const assignUpdatePlaylistType = async (
  data: z.infer<typeof assignUpdatePlaylistTypeSchema>,
  playlistId: string,
  actionType: 'Assign' | 'Update'
): Promise<ActionResponse<null>> => {
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

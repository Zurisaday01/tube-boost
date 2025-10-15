'use server';

import { prisma } from '@/lib/db/prisma';
import { PlaylistVideoNote, Prisma } from '@prisma/client';
import { getSessionUser, isUserAuthenticated } from '@/lib/utils/actions';
import { ActionResponse, SaveNoteInput } from '@/types/actions';

export const savePlaylistVideoNote = async ({
  playlistVideoId,
  document
}: SaveNoteInput): Promise<ActionResponse<PlaylistVideoNote>> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    // Upsert: create if not exists, update if exists
    const note = await prisma.playlistVideoNote.upsert({
      where: { playlistVideoId }, // one-to-one key
      update: {
        document: document as Prisma.InputJsonValue,
        userId: user.userId
      },
      create: {
        playlistVideoId,
        userId: user.userId,
        document: document as Prisma.InputJsonValue
      }
    });

    return {
      status: 'success',
      message: 'Note saved successfully.',
      data: note
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to save note.'
    };
  }
};

export const getPlaylistVideoNote = async (
  playlistVideoId: string
): Promise<ActionResponse<PlaylistVideoNote | null>> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated');
    }

    const note = await prisma.playlistVideoNote.findFirst({
      where: {
        playlistVideoId,
        userId: user.userId
      }
    });

    return {
      status: 'success',
      message: 'Note fetched successfully.',
      data: note
    };
  } catch (error: unknown) {
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch note.',
      data: null
    };
  }
};

'use server';

import { prisma } from '../db/prisma';
import { Prisma } from '@prisma/client';
import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from 'auth';

interface SaveNoteInput {
  playlistVideoId: string;
  document: string; // BlockNote document JSON
}

export const savePlaylistVideoNote = async ({
  playlistVideoId,
  document
}: SaveNoteInput) => {
  // get user id
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // return a nullable value for unauthorized access
  if (!session?.user.id) {
    return null;
  }

  try {
    // Upsert: create if not exists, update if exists
    const note = await prisma.playlistVideoNote.upsert({
      where: { playlistVideoId }, // one-to-one key
      update: {
        document: document as Prisma.InputJsonValue,
        userId: session.user.id
      },
      create: {
        playlistVideoId,
        userId: session.user.id,
        document: document as Prisma.InputJsonValue
      }
    });

    return note;
  } catch (error: unknown) {
    console.error('Error saving playlist video note:', error);
    return (error as Error).message || 'Failed to save note.';
  }
};

export const getPlaylistVideoNote = cache(async (playlistVideoId: string) => {
  // get user id
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // return a nullable value for unauthorized access
  if (!session?.user.id) {
    return null;
  }

  try {
    const note = await prisma.playlistVideoNote.findFirst({
      where: {
        playlistVideoId,
        userId: session.user.id
      }
    });

    return note;
  } catch (error) {
    console.error('Error fetching playlist video note:', error);
    return null;
  }
});

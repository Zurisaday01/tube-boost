'use server';

import { VideoData } from '@/types';
import { prisma } from '../db/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { headers } from 'next/headers';
import { auth } from 'auth';

export const createVideoAndAttach = async (
  data: VideoData,
  playlistId: string,
  subcategoryId?: string
) => {
  if (
    !data.youtubeVideoId ||
    !data.title ||
    !data.channelId ||
    !data.channelTitle ||
    !data.thumbnails
  ) {
    return { success: false, error: 'Missing required video fields.' };
  }

  try {
    // Ensure we don’t create duplicates
    let video = await prisma.video.findUnique({
      where: { youtubeVideoId: data.youtubeVideoId }
    });

    if (!video) {
      video = await prisma.video.create({
        data: {
          youtubeVideoId: data.youtubeVideoId,
          title: data.title,
          channelId: data.channelId,
          channelTitle: data.channelTitle,
          duration: data.duration ?? null,
          thumbnails: data.thumbnails as unknown as Prisma.InputJsonValue
        }
      });
    }
    // Get the current max orderIndex in the right scope
    const lastVideo = await prisma.playlistVideo.findFirst({
      where: {
        playlistId,
        subcategoryId: subcategoryId ?? null
      },
      orderBy: {
        orderIndex: 'desc'
      }
    });

    const nextIndex = lastVideo ? lastVideo.orderIndex + 1 : 0;

    // Create link in PlaylistVideo
    /*
    Scoped relative to where the video is being added:
      If it’s added to the playlist directly (uncategorized), then the orderIndex should be the next available index among playlistVideos with subcategoryId = null.
      If it’s added to a subcategory, then the orderIndex should be the next available index among playlistVideos with that same subcategoryId.
    */
    await prisma.playlistVideo.create({
      data: {
        playlistId,
        videoId: video.id,
        subcategoryId: subcategoryId ?? null,
        orderIndex: nextIndex,
        addedAt: new Date()
      }
    });

    revalidatePath(`/dashboard/playlists/${playlistId}`);

    return { success: true, video };
  } catch (error) {
    console.error('Error creating video:', error);
    return { success: false, error: 'Failed to create video.' };
  }
};

interface ReorderVideosInput {
  playlistId: string;
  subcategoryId?: string;
  videoIds: string[]; // ordered array of playlistVideo IDs
}

export const reorderPlaylistVideos = async ({
  playlistId,
  videoIds
}: ReorderVideosInput) => {
  try {
    // Update all videos in one transaction
    await prisma.$transaction(
      videoIds.map((id, index) =>
        prisma.playlistVideo.update({
          where: { id },
          data: { orderIndex: index }
        })
      )
    );

    // Revalidate the playlist page
    revalidatePath(`/dashboard/playlists/${playlistId}`);

    return { success: true };
  } catch (error) {
    console.error('Error reordering videos:', error);
    return { success: false, error: 'Failed to reorder videos.' };
  }
};

export const getPlaylistVideoById = cache(async (id: string) => {
  // get user id
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // return a nullable value for unauthorized access
  if (!session?.user.id) {
    return null;
  }

  try {
    const video = await prisma.playlistVideo.findFirst({
      where: {
        id,
        playlist: {
          userId: session.user.id
        }
      },
      include: {
        video: true
      }
    });

    if (!video) {
      throw new Error('Playlist video not found');
    }

    return video;
  } catch (error) {
    console.error('Error fetching playlist video:', error);
    return null;
  }
});

interface SaveNoteInput {
  playlistVideoId: string;
  document: string; // BlockNote document JSON
}

export async function savePlaylistVideoNote({
  playlistVideoId,
  document
}: SaveNoteInput) {
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
}

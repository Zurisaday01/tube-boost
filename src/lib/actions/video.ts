'use server';

import { VideoData } from '@/types';
import { prisma } from '@/lib/db/prisma';
import { Prisma, Video } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { getSessionUser, isUserAuthenticated } from '@/lib/utils/actions';
import {
  ActionResponse,
  PlaylistVideoWithVideo,
  ReorderVideosInput
} from '@/types/actions';

export const createVideoAndAttach = async (
  data: VideoData,
  playlistId: string,
  subcategoryId?: string
): Promise<ActionResponse<Video>> => {
  try {
    if (
      !data.youtubeVideoId ||
      !data.title ||
      !data.channelId ||
      !data.channelTitle ||
      !data.thumbnails
    ) {
      throw new Error('Missing required video data fields.');
    }

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

    return { status: 'success', message: 'Video added successfully.', data: video };
  } catch (error) {
    console.error('Error creating video:', error);
    return { status: 'error', message: 'Failed to create video.' };
  }
};

export const reorderPlaylistVideos = async ({
  playlistId,
  videoIds
}: ReorderVideosInput): Promise<ActionResponse> => {
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

    return { status: 'success', message: 'Videos reordered successfully.' };
  } catch (error) {
    console.error('Error reordering videos:', error);
    return { status: 'error', message: 'Failed to reorder videos.' };
  }
};

export const getPlaylistVideoById = cache(
  async (id: string): Promise<ActionResponse<PlaylistVideoWithVideo>> => {
    try {
      const user = await getSessionUser();

      if (!isUserAuthenticated(user)) {
        throw new Error('User not authenticated.');
      }

      const video = await prisma.playlistVideo.findFirst({
        where: {
          id,
          playlist: {
            userId: user.userId
          }
        },
        include: {
          video: true
        }
      });

      if (!video) {
        throw new Error('Playlist video not found');
      }

      return {
        status: 'success',
        message: 'Playlist video fetched successfully.',
        data: video as PlaylistVideoWithVideo
      };
    } catch (error) {
      return {
        status: 'error',
        message: (error as Error).message || 'Failed to fetch playlist video.'
      };
    }
  }
);

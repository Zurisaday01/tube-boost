'use server';

import { VideoData } from '@/types';
import { prisma } from '@/lib/db/prisma';
import { Prisma, Video } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getSessionUser, isUserAuthenticated } from '@/lib/utils/actions';
import {
  ActionResponse,
  PlaylistVideoWithVideo,
  ReorderVideosInput
} from '@/types/actions';
import { getVideoData } from './youtube';

export const checkVideoExists = async (
  youtubeVideoId: string // YouTube video ID from API
): Promise<ActionResponse<Video | null>> => {
  try {
    if (!youtubeVideoId) throw new Error('Missing video ID.');

    const video = await prisma.video.findUnique({
      where: { youtubeVideoId }
    });

    if (video) {
      return {
        status: 'success',
        message: 'Video exists in the database.',
        data: video
      };
    } else {
      return {
        status: 'success',
        message: 'Video does not exist.'
      };
    }
  } catch (err) {
    return {
      status: 'error',
      message: 'Failed to check video existence.'
    };
  }
};

export const createVideoAndAttach = async (
  data: VideoData,
  playlistId: string,
  subcategoryId?: string
): Promise<ActionResponse<Video>> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }
    // Ensure target playlist belongs to the user
    const ownsPlaylist = await prisma.playlist.findFirst({
      where: { id: playlistId, userId: user.userId },
      select: { id: true }
    });

    if (!ownsPlaylist) {
      throw new Error('Unauthorized playlist access.');
    }
    // Basic validation
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
    // If the video already exists, we just link it in PlaylistVideo
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

    // Make sure the video is not already linked to the uncategorized (playlist-level) or subcategory group
    const existingLink = await prisma.playlistVideo.findFirst({
      where: {
        playlistId,
        videoId: video.id,
        subcategoryId: subcategoryId ?? null
      }
    });

    if (existingLink) {
      return {
        status: 'error',
        message: `Video is already in this ${subcategoryId ? 'subcategory' : 'playlist'}.`
      };
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

    return {
      status: 'success',
      message: 'Video added successfully.',
      data: video
    };
  } catch (error) {
    console.error('Error creating video:', error);
    return { status: 'error', message: 'Failed to create video.' };
  }
};

/*
Check if the video already exists in your database
If it does, return it directly
If it doesn’t, fetch from YouTube with getVideoData and return it
*/
// fetch from YouTube if not in DB
export const fetchVideoData = async (
  youtubeVideoId: string
): Promise<VideoData> => {
  // 1. Check if the video exists in DB
  const existing = await checkVideoExists(youtubeVideoId);

  if (existing.status === 'error') {
    throw new Error(existing.message);
  }

  if (existing.data) {
    // Already in DB, return it
    return {
      youtubeVideoId: existing.data.youtubeVideoId,
      title: existing.data.title,
      channelId: existing.data.channelId,
      channelTitle: existing.data.channelTitle,
      duration: existing.data.duration,
      thumbnails: existing.data.thumbnails
    } as unknown as VideoData;
  }

  // 2. Not in DB → fetch from YouTube
  const videoData = await getVideoData(youtubeVideoId);
  if (!videoData) throw new Error('Video not found on YouTube.');

  return videoData;
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

interface MovePlaylistVideoParams {
  playlistVideoId: string;
  targetSubcategoryId: string | null; // null means uncategorized and string means a specific subcategory ID
  currentSubcategoryId: string | null; // null means uncategorized and string means a specific subcategory ID
}

export const movePlaylistVideoWithinPlaylist = async ({
  playlistVideoId,
  targetSubcategoryId,
  currentSubcategoryId
}: MovePlaylistVideoParams): Promise<ActionResponse> => {
  try {
    const user = await getSessionUser();

    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated.');
    }

    // Find the playlist video and ensure it belongs to the user
    const playlistVideo = await prisma.playlistVideo.findFirst({
      where: {
        id: playlistVideoId,
        playlist: {
          userId: user.userId
        }
      }
    });

    if (!playlistVideo) {
      throw new Error('Playlist video not found.');
    }

    // If moving into a subcategory, ensure it belongs to this playlist
    if (targetSubcategoryId) {
      const targetSubcategory = await prisma.subcategory.findFirst({
        where: {
          id: targetSubcategoryId,
          playlistId: playlistVideo.playlistId
        },
        select: { id: true }
      });

      if (!targetSubcategory) {
        throw new Error('Target subcategory not found or unauthorized.');
      }
    }

    const currentSubcategoryId = playlistVideo.subcategoryId;

    // Get the max orderIndex in the target group to append this video
    const lastVideoInTarget = await prisma.playlistVideo.findFirst({
      where: {
        playlistId: playlistVideo.playlistId,
        subcategoryId: targetSubcategoryId
      },
      orderBy: { orderIndex: 'desc' }
    });
    const targetOrderIndex = lastVideoInTarget
      ? lastVideoInTarget.orderIndex + 1
      : 0;

    // Update the subcategoryId of the playlist video (nullable)
    await prisma.playlistVideo.update({
      where: { id: playlistVideoId },
      data: { subcategoryId: targetSubcategoryId, orderIndex: targetOrderIndex }
    });

    // Reindex remaining videos in the source group
    if (currentSubcategoryId !== targetSubcategoryId) {
      const remainingInSource = await prisma.playlistVideo.findMany({
        where: {
          playlistId: playlistVideo.playlistId,
          subcategoryId: currentSubcategoryId,
          id: { not: playlistVideoId }
        },
        orderBy: { orderIndex: 'asc' }
      });

      await prisma.$transaction(
        remainingInSource.map((video, i) =>
          prisma.playlistVideo.update({
            where: { id: video.id },
            data: { orderIndex: i }
          })
        )
      );
    }

    // Revalidate the playlist page
    revalidatePath(`/dashboard/playlists/${playlistVideo.playlistId}`);

    // Revalidate the target subcategory page if applicable
    if (targetSubcategoryId) {
      revalidatePath(
        `/dashboard/playlists/${playlistVideo.playlistId}/subcategory/${targetSubcategoryId}`
      );
    }

    // Revalidate the current subcategory page if applicable
    if (currentSubcategoryId) {
      revalidatePath(
        `/dashboard/playlists/${playlistVideo.playlistId}/subcategory/${currentSubcategoryId}`
      );
    }

    return {
      status: 'success',
      message: 'Playlist video moved successfully.'
    };
  } catch (error) {
    console.error('Error moving playlist video:', error);
    return {
      status: 'error',
      message: 'Failed to move playlist video.'
    };
  }
};

export const reorderUncategorizedVideos = async ({
  playlistId,
  videoIds
}: ReorderVideosInput): Promise<ActionResponse> => {
  try {
    // Validate that all given IDs belong to this playlist and are uncategorized
    const existingVideos = await prisma.playlistVideo.findMany({
      where: {
        id: { in: videoIds },
        playlistId,
        subcategoryId: null
      },
      select: { id: true }
    });

    if (existingVideos.length !== videoIds.length) {
      throw new Error(
        'Some videos are not uncategorized or do not belong to this playlist.'
      );
    }

    // Update order safely in one transaction
    await prisma.$transaction(
      videoIds.map((id, index) =>
        prisma.playlistVideo.update({
          where: { id },
          data: { orderIndex: index }
        })
      )
    );

    revalidatePath(`/dashboard/playlists/${playlistId}`);

    return {
      status: 'success',
      message: 'Uncategorized videos reordered successfully.'
    };
  } catch (error) {
    console.error('Error reordering uncategorized videos:', error);
    return {
      status: 'error',
      message: 'Failed to reorder uncategorized videos.'
    };
  }
};

export const getPlaylistVideoById = async (
  id: string
): Promise<ActionResponse<PlaylistVideoWithVideo>> => {
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
        video: true,
        videoTags: {
          include: {
            tag: {
              include: {
                group: {
                  select: {
                    color: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!video) {
      throw new Error('Playlist video not found');
    }

    return {
      status: 'success',
      message: 'Playlist video fetched successfully.',
      data: video
    };
  } catch (error) {
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch playlist video.'
    };
  }
};

// Delete a playlist video, and if the video is orphaned (not referenced in any other playlist), delete the video as well
export const deletePlaylistVideo = async (
  playlistVideoId: string,
  title: string
): Promise<ActionResponse> => {
  try {
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) throw new Error('User not authenticated.');

    const target = await prisma.playlistVideo.findFirst({
      where: {
        id: playlistVideoId,
        playlist: { userId: user.userId }
      },
      include: { video: true }
    });
    if (!target) throw new Error('Playlist video not found or unauthorized.');

    // Delete the playlist video
    await prisma.playlistVideo.delete({ where: { id: playlistVideoId } });

    //  Reindex remaining videos in the same subcategory or uncategorized group
    const remainingVideos = await prisma.playlistVideo.findMany({
      where: {
        playlistId: target.playlistId, // same playlist
        id: { not: playlistVideoId },
        // If the video was in a subcategory, reindex within that subcategory.
        // If it was uncategorized (subcategoryId = null), reindex uncategorized videos.
        subcategoryId: target.subcategoryId ?? null // handle both categorized and uncategorized
      },
      orderBy: { orderIndex: 'asc' }
    });

    // Reset orderIndex to be sequential (transactional)
    await prisma.$transaction(
      remainingVideos.map((video, i) =>
        prisma.playlistVideo.update({
          where: { id: video.id },
          data: { orderIndex: i }
        })
      )
    );

    // Check if the video is now orphaned
    const remainingRefs = await prisma.playlistVideo.count({
      where: { videoId: target.video.id }
    });
    if (remainingRefs === 0) {
      await prisma.video.delete({ where: { id: target.video.id } });
    }
    // Revalidate relevant path for the playlist
    revalidatePath(`/dashboard/playlists/${target.playlistId}`);
    if (target.subcategoryId) {
      revalidatePath(
        `/dashboard/playlists/${target.playlistId}/subcategory/${target.subcategoryId}`
      );
    }
    return {
      status: 'success',
      message: `Deleted playlist video "${title}" successfully.`
    };
  } catch (err) {
    console.error('Error deleting playlist video:', err);
    return {
      status: 'error',
      message: `Failed to delete playlist video "${title}".`
    };
  }
};

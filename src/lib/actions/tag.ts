'use server';

import { z } from 'zod';
import { createTagSchema, updateTagSchema } from '@/lib/schemas';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { devLog } from '@/lib/utils';
import { getSessionUser, isUserAuthenticated } from '@/lib/utils/actions';
import {
  ActionResponse,
  TagWithCount,
  VideoTagResponse
} from '@/types/actions';
import { Tag } from '@prisma/client';
import { ComboboxDataItem } from '@/types';

export const getTagsByTagGroup = async (
  id: string
): Promise<ActionResponse<TagWithCount[]>> => {
  try {
    // Verify user is authenticated
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated');
    }

    const tags = await prisma.tag.findMany({
      where: { groupId: id, group: { userId: user.userId } }, // check user ownership through group
      include: {
        _count: {
          select: { videos: true }
        }
      }
    });

    // Map _count.videos to totalVideos while keeping the rest of the fields
    const formattedTags: TagWithCount[] = tags.map(({ _count, ...rest }) => ({
      ...rest,
      totalVideos: _count.videos
    }));

    return {
      status: 'success',
      message: 'Tags fetched successfully.',
      data: formattedTags
    };
  } catch (error) {
    devLog.error('Error fetching tags:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch tags.'
    };
  }
};

// For SelectTagOptions component to get all tags across groups
export const getAllTagsOptions = async (): Promise<
  ActionResponse<Record<string, ComboboxDataItem[]>>
> => {
  try {
    // Verify user is authenticated
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated');
    }

    const groupTags = await prisma.tagGroup.findMany({
      where: { userId: user.userId }, // check user ownership through group
      include: {
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Transform to Record<string, ComboboxDataItem[]>
    const groupedTags: Record<string, ComboboxDataItem[]> = {};

    for (const group of groupTags) {
      groupedTags[group.name] = group.tags.map((tag) => ({
        value: tag.id,
        label: tag.name
      }));
    }

    return {
      status: 'success',
      message: 'Tags fetched successfully.',
      data: groupedTags
    };
  } catch (error) {
    devLog.error('Error fetching tags:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch tags.'
    };
  }
};

export const addTagToVideo = async (
  tagId: string,
  playlistVideoId: string
): Promise<ActionResponse<VideoTagResponse>> => {
  try {
    // Verify user is authenticated
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated');
    }

    // Verify ownership of the tag and video
    const tag = await prisma.tag.findFirst({
      where: { id: tagId, group: { userId: user.userId } }
    });
    const video = await prisma.playlistVideo.findFirst({
      where: {
        id: playlistVideoId,
        playlist: {
          userId: user.userId
        }
      }
    });

    if (!tag) {
      throw new Error('Tag not found or access denied.');
    }
    if (!video) {
      throw new Error('Video not found or access denied.');
    }

    // Check if the VideoTag relation already exists
    const existingRelation = await prisma.videoTag.findFirst({
      where: {
        videoId: playlistVideoId,
        tagId: tagId
      },
      include: { tag: true }
    });

    if (existingRelation) {
      throw new Error(`Tag '${existingRelation.tag.name}' is already associated with this video.`);
    }

    // Create VideoTag relation
    const createdVideoTag = await prisma.videoTag.create({
      data: {
        videoId: playlistVideoId,
        playlistVideo: {
          connect: { id: playlistVideoId }
        },
        tag: {
          connect: { id: tagId }
        }
      },
      include: {
        tag: true
      }
    });

    revalidatePath(`/dashboard/videos/${playlistVideoId}`);

    return {
      status: 'success',
      message: `Tag '${createdVideoTag.tag.name}' added to video successfully.`,
      data: createdVideoTag
    };
  } catch (error) {
    devLog.error('Error adding tag to video:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to add tag to video.'
    };
  }
};


export const removeTagFromVideo = async (
  tagId: string,
  playlistVideoId: string
): Promise<ActionResponse> => {
  try {
    // Verify user is authenticated
    const user = await getSessionUser();
    if (!isUserAuthenticated(user)) {
      throw new Error('User not authenticated');
    }

    // Verify ownership of the tag and video
    const tag = await prisma.tag.findFirst({
      where: { id: tagId, group: { userId: user.userId } }
    });
    const video = await prisma.playlistVideo.findFirst({
      where: {
        id: playlistVideoId,
        playlist: {
          userId: user.userId
        }
      }
    });

    if (!tag) {
      throw new Error('Tag not found or access denied.');
    }
    if (!video) {
      throw new Error('Video not found or access denied.');
    }

    // Delete the VideoTag relation
    await prisma.videoTag.deleteMany({
      where: {
        videoId: playlistVideoId,
        tagId: tagId
      }
    });

    revalidatePath(`/dashboard/videos/${playlistVideoId}`);

    return {
      status: 'success',
      message: `Tag '${tag.name}' removed from video successfully.`
    };
  } catch (error) {
    devLog.error('Error removing tag from video:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to remove tag from video.'
    };
  }
};

export const createTag = async (
  data: z.infer<typeof createTagSchema>,
  groupId: string
): Promise<ActionResponse<Tag>> => {
  try {
    // Validate server side
    const parsed = createTagSchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    // Destructure the parsed data
    const { name } = parsed.data;

    // Validate groupId
    const group = await prisma.tagGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) throw new Error('Tag group not found.');

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        name,
        groupId
      }
    });

    // Revalidate the path where the tags are displayed.
    revalidatePath('/dashboard/tag-groups');
    revalidatePath(`/dashboard/tag-groups/${groupId}`);

    return {
      status: 'success',
      message: `Tag '${tag.name}' created successfully.`,
      data: tag
    };
  } catch (error) {
    devLog.error('Error creating tag:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to create tag.'
    };
  }
};

export const updateTag = async (
  id: string,
  data: z.infer<typeof updateTagSchema>
): Promise<ActionResponse<Tag>> => {
  try {
    // Validate server side
    const parsed = updateTagSchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    // Destructure the parsed data
    const { name } = parsed.data;

    // Update tag
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name
      }
    });

    // Revalidate using authoritative DB value
    revalidatePath(`/dashboard/tag-groups/${tag.groupId}`);

    return {
      status: 'success',
      message: `Tag '${tag.name}' updated successfully.`,
      data: tag
    };
  } catch (error) {
    devLog.error('Error updating tag:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to update tag.'
    };
  }
};

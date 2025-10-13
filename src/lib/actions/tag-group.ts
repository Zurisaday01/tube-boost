'use server';
import { z } from 'zod';
import { createTagGroupSchema } from '@/lib/schemas';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { devLog } from '@/lib/utils';
import { cache } from 'react';
import { getSessionUser, isUserAuthenticated } from '@/lib/utils/actions';
import { TagGroup } from '@prisma/client';
import { ActionResponse } from '@/types/actions';

export const createTagGroup = async (
  data: z.infer<typeof createTagGroupSchema>
): Promise<ActionResponse<TagGroup>> => {
  try {
    const user = await getSessionUser();

    if (!isUserAuthenticated(user)) {
      throw new Error('You must be logged in to create a playlist.');
    }
    // Validate server side
    const parsed = createTagGroupSchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    const { name, description } = parsed.data;

    // Create the tag group
    const tagGroup = await prisma.tagGroup.create({
      data: {
        name,
        description,
        userId: user.userId // Associate with the logged-in user
      }
    });

    // Revalidate the path where the tag groups are displayed.
    revalidatePath(`/dashboard/tag-groups/${tagGroup.id}`);

    return {
      status: 'success',
      message: `'${tagGroup.name}' created successfully!`,
      data: tagGroup
    };
  } catch (error) {
    devLog.error('Error creating tag group:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to create tag group.'
    };
  }
};

export const updateTagGroupColor = async (
  id: string,
  color: string,
  name: string // for error messages only
): Promise<ActionResponse<TagGroup>> => {
  try {
    // Update tag group color
    const tagGroup = await prisma.tagGroup.update({
      where: { id },
      data: { color }
    });

    // Revalidate the path where the tag groups are displayed.
    revalidatePath(`/dashboard/tag-groups/${tagGroup.id}`);

    return {
      status: 'success',
      message: `Color updated to ${color} for '${tagGroup.name}' tag group`,
      data: tagGroup
    };
  } catch (error) {
    devLog.error('Error updating tag group color:', error);
    return {
      status: 'error',
      message: (error as Error).message || `Failed to update color for '${name}' tag group.`
    };
  }
};


export const updateTagGroup = async (
  tagGroupId: string,
  data: z.infer<typeof createTagGroupSchema>
): Promise<ActionResponse<TagGroup>> => {
  try {
    const user = await getSessionUser();

    if (!isUserAuthenticated(user)) {
      throw new Error('You must be logged in to update a tag group.');
    }

    // Validate server side
    const parsed = createTagGroupSchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    const { name, description } = parsed.data;

    // Update the tag group
    await prisma.tagGroup.updateMany({
      where: {
        id: tagGroupId,
        userId: user.userId // Ensure the user owns the tag group
      },
      data: {
        name,
        description
      }
    });

    // Revalidate the path where the tag groups are displayed.
    revalidatePath(`/dashboard/tag-groups/${tagGroupId}`);

    return {
      status: 'success',
      message: `'${name}' updated successfully!`
    };


  } catch (error) {
    devLog.error('Error updating tag group:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to update tag group.'
    };
  }
}



export const getAllTagGroups = cache(
  async (): Promise<ActionResponse<TagGroup[]>> => {
    try {
      const user = await getSessionUser();
      if (!isUserAuthenticated(user)) {
        throw new Error('User not authenticated.');
      }

      const tagGroups = await prisma.tagGroup.findMany({
        where: { userId: user.userId },
        include: {
          tags: {
            include: { _count: { select: { videos: true } } }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      return {
        status: 'success',
        message: 'Tag groups fetched successfully.',
        data: tagGroups
      };
    } catch (error) {
      devLog.error('Error fetching tag groups:', error);
      return {
        status: 'error',
        message: (error as Error).message || 'Failed to fetch tag groups.'
      };
    }
  }
);

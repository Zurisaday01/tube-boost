'use server';
import { z } from 'zod';
import { createSubcategorySchema, updateSubcategorySchema } from '@/lib/schemas';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { devLog } from '@/lib/utils';
import {
  ActionResponse,
  DeleteActionResponse,
  SubcategoryWithStats
} from '@/types/actions';
import { Subcategory } from '@prisma/client';

export const createSubcategory = async (
  data: z.infer<typeof createSubcategorySchema>
): Promise<ActionResponse<Subcategory>> => {
  try {
    // Validate server side
    const parsed = createSubcategorySchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    // Destructure the parsed data
    const { name, playlistId } = parsed.data;

    // Get max orderIndex in this playlist
    const last = await prisma.subcategory.findFirst({
      where: { playlistId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true }
    });

    const nextIndex = last ? last.orderIndex + 1 : 0;

    // Create subcategory
    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        playlistId,
        orderIndex: nextIndex
      }
    });

    // Revalidate the path where the subcategories are displayed.
    revalidatePath(`/dashboard/playlists/${playlistId}`);

    return {
      status: 'success',
      message: `Subcategory '${subcategory.name}' created successfully.`,
      data: subcategory
    };
  } catch (error) {
    devLog.error('Error creating subcategory:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to create subcategory.'
    };
  }
};

export const getAllSubcategories = async (
  playlistId: string
): Promise<ActionResponse<Subcategory[]>> => {
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { playlistId },
      include: {
        playlist: { select: { title: true } }
      },
      orderBy: { orderIndex: 'asc' }
    });
    return {
      status: 'success',
      message: 'Subcategories fetched successfully.',
      data: subcategories
    };
  } catch (error) {
    devLog.error('Error fetching subcategories:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch subcategories.'
    };
  }
};

export const getSubcategoryById = async (
  id: string
): Promise<ActionResponse<SubcategoryWithStats>> => {
  try {
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      include: {
        playlist: true,
        videos: {
          include: {
            video: true
          },
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: {
            videos: true // videos directly in subcategory
          }
        }
      }
    });

    if (!subcategory) {
      throw new Error('Subcategory not found');
    }

    const subcategoryWithStats: SubcategoryWithStats = {
      id: subcategory.id,
      playlistId: subcategory.playlistId,
      name: subcategory.name,
      color: subcategory.color,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
      videos: subcategory.videos,
      totalVideos: subcategory?._count.videos || 0
    };

    return {
      status: 'success',
      message: 'Subcategory fetched successfully.',
      data: subcategoryWithStats
    };
  } catch (error) {
    devLog.error('Error fetching subcategory:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to fetch subcategory.'
    };
  }
};

export const updateSubcategory = async (
  id: string,
  data: z.infer<typeof updateSubcategorySchema>
): Promise<ActionResponse<Subcategory>> => {
  try {
    // Validate server side
    const parsed = updateSubcategorySchema.safeParse(data);

    if (!parsed.success) throw new Error('Validation was not successful.');

    // Destructure the parsed data
    const { name } = parsed.data;

    // Update subcategory
    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name
      }
    });

    // Revalidate using authoritative DB value
    revalidatePath(`/dashboard/playlists/${subcategory.playlistId}`);

    return {
      status: 'success',
      message: `Subcategory '${subcategory.name}' updated successfully.`,
      data: subcategory
    };
  } catch (error) {
    devLog.error('Error updating subcategory:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to update subcategory.'
    };
  }
};

export const updateColor = async (
  id: string,
  color: string,
  name: string
): Promise<ActionResponse<Subcategory>> => {
  try {
    // Update subcategory color
    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: { color }
    });

    // Revalidate the path where the subcategories are displayed.
    revalidatePath(`/dashboard/playlists/${subcategory.playlistId}`);

    return {
      status: 'success',
      message: `Color updated to ${color} for '${subcategory.name}' subcategory`,
      data: subcategory
    };
  } catch (error) {
    devLog.error('Error updating subcategory color:', error);
    return {
      status: 'error',
      message:
        (error as Error).message ||
        `Failed to update color for '${name}' subcategory.`
    };
  }
};

export const deleteSubcategory = async (
  id: string
): Promise<DeleteActionResponse> => {
  try {
    // Find the subcategory to get its playlistId before deletion
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      select: { playlistId: true }
    });

    if (!subcategory) throw new Error('Subcategory not found.');

    // Delete the subcategory
    await prisma.subcategory.delete({
      where: { id }
    });

    // Revalidate the path where the subcategories are displayed.
    revalidatePath(`/dashboard/playlists/${subcategory.playlistId}`);

    return { status: 'success', message: 'Subcategory deleted successfully.' };
  } catch (error) {
    devLog.error('Error deleting subcategory:', error);
    return {
      status: 'error',
      message: (error as Error).message || 'Failed to delete subcategory.'
    };
  }
};

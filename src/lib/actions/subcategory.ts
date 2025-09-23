'use server';
import { z } from 'zod';
import { createSubcategorySchema } from '@/lib/schemas';
import { prisma } from '../db/prisma';
import { revalidatePath } from 'next/cache';
import { devLog } from '../utils';
import { cache } from 'react';

export const createSubcategory = async (
  data: z.infer<typeof createSubcategorySchema>
) => {
  try {
    // Validate server side
    const parsed = createSubcategorySchema.parse(data);

    // Get max orderIndex in this playlist
    const last = await prisma.subcategory.findFirst({
      where: { playlistId: parsed.playlistId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true }
    });

    const nextIndex = last ? last.orderIndex + 1 : 0;

    // Create subcategory
    const subcategory = await prisma.subcategory.create({
      data: {
        name: parsed.name,
        playlistId: parsed.playlistId,
        orderIndex: nextIndex
      }
    });

    // Revalidate the path where the subcategories are displayed.
    revalidatePath(`/dashboard/playlists/${parsed.playlistId}`);

    return { success: true, subcategory };
  } catch (error) {
    devLog.error('Error creating subcategory:', error);
    return { success: false, error: 'Failed to create subcategory.' };
  }
};

export const getAllSubcategories = cache(async (playlistId: string) => {
  const subcategories = await prisma.subcategory.findMany({
    where: { playlistId },
    include: {
      playlist: { select: { title: true } }
    },
    orderBy: { orderIndex: 'asc' }
  });
  return subcategories;
});

export const getSubcategoryById = cache(async (id: string) => {
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

  return {
    id: subcategory.id,
    playlistId: subcategory.playlistId,
    name: subcategory.name,
    color: subcategory.color,
    createdAt: subcategory.createdAt,
    updatedAt: subcategory.updatedAt,
    videos: subcategory.videos,
    totalVideos: subcategory?._count.videos || 0
  };
});

export const updateSubcategory = async (
  id: string,
  data: z.infer<typeof createSubcategorySchema>
) => {
  try {
    console.log('Updating subcategory with data:', data);
    // Validate server side
    const parsed = createSubcategorySchema.parse(data);

    // Update subcategory
    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name: parsed.name
      }
    });

    // Revalidate the path where the subcategories are displayed.
    revalidatePath(`/dashboard/playlists/${parsed.playlistId}`);

    return { success: true, subcategory };
  } catch (error) {
    devLog.error('Error updating subcategory:', error);
    return { success: false, error: 'Failed to update subcategory.' };
  }
};

export const updateColor = async (id: string, color: string) => {
  try {
    // Update subcategory color
    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: { color }
    });

    // Revalidate the path where the subcategories are displayed.
    revalidatePath(`/dashboard/playlists/${subcategory.playlistId}`);

    return { success: true, subcategory };
  } catch (error) {
    devLog.error('Error updating subcategory color:', error);
    return { success: false, error: 'Failed to update subcategory color.' };
  }
};

export const deleteSubcategory = async (id: string) => {
  try {
    // Find the subcategory to get its playlistId before deletion
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      select: { playlistId: true }
    });

    if (!subcategory) {
      return { success: false, error: 'Subcategory not found.' };
    }

    // Delete the subcategory
    await prisma.subcategory.delete({
      where: { id }
    });

    // Revalidate the path where the subcategories are displayed.
    revalidatePath(`/dashboard/playlists/${subcategory.playlistId}`);

    return { success: true };
  } catch (error) {
    devLog.error('Error deleting subcategory:', error);
    return { success: false, error: 'Failed to delete subcategory.' };
  }
};

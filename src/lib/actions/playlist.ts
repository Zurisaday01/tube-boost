'use server';

import { z } from 'zod';
import { createPlaylistSchema } from '@/lib/schemas';
import { prisma } from '../db/prisma';
import { auth } from 'auth';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { devLog } from '../utils';
import { headers } from 'next/headers';

export const createPlaylist = async (
  data: z.infer<typeof createPlaylistSchema>
) => {
  try {
    // get headers from the server environment
    const reqHeaders = await headers();
    // Get the session to verify the user
    const sessionResult = await auth.api.getSession({
      query: {
        disableCookieCache: true
      },
      headers: reqHeaders
    });

    // Check if session exists
    if (!sessionResult || !sessionResult.user) {
      throw new Error('You must be logged in to create a playlist.');
    }

    const user = sessionResult.user;
    // Validate server side
    const parsed = createPlaylistSchema.parse(data);

    // Create playlist
    const playlist = await prisma.playlist.create({
      data: {
        title: parsed.title,
        userId: user.id,
        source: 'MANUAL'
      }
    });

    revalidatePath('/dashboard/playlists');

    return { success: true, playlist };
  } catch (error) {
    devLog.error('Error creating subcategory:', error);
    return { success: false, error: 'Failed to create subcategory.' };
  }
};

export const getAllPlaylists = cache(async () => {
  // get user id
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user.id) {
    return [];
  }

  const playlists = await prisma.playlist.findMany({
    where: { userId: session?.user.id },
    select: {
      id: true,
      title: true,
      source: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          videos: true, // videos directly in playlist
          subcategories: true // number of categories
        }
      },
      subcategories: {
        select: {
          _count: { select: { videos: true } } // videos per subcategory
        }
      }
    }
  });

  return playlists.map((playlist) => {
    const totalVideosInSubcategories = playlist.subcategories.reduce(
      (acc, sub) => acc + sub._count.videos,
      0
    );
    const totalVideos = playlist._count.videos + totalVideosInSubcategories;

    return {
      id: playlist.id,
      title: playlist.title,
      source: playlist.source,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
      totalCategories: playlist._count.subcategories,
      totalVideos
    };
  });
});

export const getPlaylistById = cache(async (id: string) => {
  // get user id
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user.id) {
    return [];
  }

  const playlist = await prisma.playlist.findUnique({
    where: { id, userId: session?.user.id },
    select: {
      id: true,
      title: true,
      source: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          videos: true,
          subcategories: true
        }
      },
      subcategories: {
        select: {
          _count: { select: { videos: true } }
        }
      }
    }
  });

  if (!playlist) {
    throw new Error('Playlist not found');
  }

  // const totalVideosInSubcategories = playlist.subcategories.reduce(
  //   (acc, sub) => acc + sub._count.videos,
  //   0
  // );
  // const totalVideos = playlist._count.videos + totalVideosInSubcategories;

  return {
    id: playlist.id,
    title: playlist.title,
    source: playlist.source,
    createdAt: playlist.createdAt,
    updatedAt: playlist.updatedAt,
    totalCategories: playlist._count.subcategories,
    totalVideos: playlist._count.videos // TODO: Review how the logic is handling this since 1 video is getting counted twice
  };
});

// Utility functions for server actions
import { VideoThumbnails } from '@/types';
import { ActionResponse, PlaylistForStatProcessing, PlaylistWithStats } from '@/types/actions';
import { auth } from 'auth';
import { headers } from 'next/headers';

export const getSessionUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const userId = session?.user?.id;
  return {
    session,
    userId,
    isAuthenticated: !!userId
  };
};

// Type guard to check if user is authenticated
export const isUserAuthenticated = (
  user: Awaited<ReturnType<typeof getSessionUser>>
): user is { session: any; userId: string; isAuthenticated: true } => {
  return user.isAuthenticated && !!user.userId;
};

// Type guard to check if action response is successful
export const isSuccess = <T>(
  response: ActionResponse<T>
): response is { status: 'success'; data: T; message: string } => {
  return response.status === 'success';
};

// Function to parse video thumbnails from JSON
export function parseVideoThumbnails<T extends { thumbnails: unknown }>(
  video: T
): Omit<T, 'thumbnails'> & { thumbnails: VideoThumbnails } {
  return {
    ...video,
    thumbnails: video.thumbnails as VideoThumbnails
  };
}

export const mapToPlaylistWithStats = (playlists: PlaylistForStatProcessing[]): PlaylistWithStats[] =>
  playlists.map((playlist) => {
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
      playlistType: playlist.playlistType,
      totalVideos
    };
  });

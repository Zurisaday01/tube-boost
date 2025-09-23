import { z } from 'zod';

export const createPlaylistSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.'
  })
});

export const searchYouTubeVideoSchema = z.object({
  link: z
    .string()
    .url('Must be a valid URL')
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      'Must be a valid YouTube link'
    )
});

export const createSubcategorySchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  playlistId: z.string().uuid('Invalid playlist ID.')
});

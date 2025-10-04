import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  })
});

export const passwordSchema = z
  .string({
    required_error: 'Password can not be empty.'
  })
  .regex(/^.{8,20}$/, {
    message: 'Minimum 8 and maximum 20 characters.'
  })
  .regex(/(?=.*[A-Z])/, {
    message: 'At least one uppercase character.'
  })
  .regex(/(?=.*[a-z])/, {
    message: 'At least one lowercase character.'
  })
  .regex(/(?=.*\d)/, {
    message: 'At least one digit.'
  })
  .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
    message: 'At least one special character.'
  });

export const signUpSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'First Name must be at least 2 characters.'
    }),
    lastName: z.string().min(2, {
      message: 'Last Name must be at least 2 characters.'
    }),
    email: z.string().email('Invalid email address.'),
    password: passwordSchema,
    confirmPassword: z.string({
      required_error: 'Confirm Password is required.'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

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

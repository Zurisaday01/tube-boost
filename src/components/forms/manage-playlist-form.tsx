'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createUpdatePlaylistSchema } from '@/lib/schemas';
import { useTransition } from 'react';
import {
  createPlaylist as createPlaylistAction,
  updatePlaylistTitle as updatePlaylistTitleAction
} from '@/lib/actions/playlist';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

import { z } from 'zod';
import { handleActionResponse } from '@/lib/utils';

interface ManagePlaylistFormProps {
  onClose: () => void;
  playlist?: {
    id: string;
    title: string;
  };
}

const ManagePlaylistForm = ({ onClose, playlist }: ManagePlaylistFormProps) => {
  const [isPending, startTransition] = useTransition();
  // 1. Define your form.
  const form = useForm<z.infer<typeof createUpdatePlaylistSchema>>({
    resolver: zodResolver(createUpdatePlaylistSchema),
    defaultValues: {
      title: playlist?.title || ''
    }
  });

  const isEditMode = !!playlist;

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createUpdatePlaylistSchema>) {
    startTransition(async () => {
      try {
        // Unify await call
        const response = await (playlist
          ? updatePlaylistTitleAction(values, playlist.id)
          : createPlaylistAction(values));

        handleActionResponse(response, () => {
          form.reset();
          onClose();
        });
      } catch (err) {
        toast.error('Failed to create playlist.');
      }
    });
  }

  const onCancel = () => {
    form.reset();
  };

  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playlist Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter playlist title'
                  autoComplete='off'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='secondary'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit'>
            {isLoading ? (
              <LoaderCircle className='h-4 w-4 animate-spin' />
            ) : isEditMode ? (
              'Rename'
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ManagePlaylistForm;

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

import { createPlaylistSchema } from '@/lib/schemas';
import { useTransition } from 'react';
import { createPlaylist as createPlaylistAction } from '@/lib/actions/playlist';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

import { z } from 'zod';
import { handleActionResponse } from '@/lib/utils';

interface CreatePlaylistFormProps {
  onClose: () => void;
}

const CreatePlaylistForm = ({ onClose }: CreatePlaylistFormProps) => {
  const [isPending, startTransition] = useTransition();
  // 1. Define your form.
  const form = useForm<z.infer<typeof createPlaylistSchema>>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      title: ''
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createPlaylistSchema>) {
    startTransition(async () => {
      try {
        const response = await createPlaylistAction(values);

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
                  disabled={isPending || form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button type='button' variant='secondary' onClick={onCancel}>
            {isPending || form.formState.isSubmitting ? (
              <LoaderCircle className='h-4 w-4 animate-spin' />
            ) : (
              'Cancel'
            )}
          </Button>
          <Button type='submit'>
            {isPending || form.formState.isSubmitting ? (
              <LoaderCircle className='h-4 w-4 animate-spin' />
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CreatePlaylistForm;

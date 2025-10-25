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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { assignUpdatePlaylistTypeSchema } from '@/lib/schemas';
import { useTransition } from 'react';
import { assignUpdatePlaylistType as assignUpdatePlaylistTypeAction } from '@/lib/actions/playlist-type';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

import { z } from 'zod';
import { handleActionResponse } from '@/lib/utils';
import useSWR from 'swr';
import { PlaylistTypeOptions } from '@/types';

interface CreateTagFormProps {
  onClose: () => void;
  actionType: 'Assign' | 'Update';
  playlistId: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

const AssignUpdatePlaylistTypeForm = ({
  onClose,
  playlistId,
  actionType
}: CreateTagFormProps) => {
  // Fetch playlist types options
  const {
    data,
    error,
    isLoading: isFetching
  } = useSWR('/api/playlist-types', fetcher);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof assignUpdatePlaylistTypeSchema>>({
    resolver: zodResolver(assignUpdatePlaylistTypeSchema),
    defaultValues: {
      playlistTypeId: ''
    }
  });

  function onSubmit(values: z.infer<typeof assignUpdatePlaylistTypeSchema>) {
    startTransition(async () => {
      try {
        const response = await assignUpdatePlaylistTypeAction(
          values,
          playlistId,
          actionType
        );

        handleActionResponse(response, () => {
          form.reset();
          onClose();
        });
      } catch (err) {
        toast.error(`Failed to ${actionType.toLowerCase()} playlist type.`);
      }
    });
  }

  const onCancel = () => {
    form.reset();
  };

  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
        {error && (
          <div className='text-red-500'>Failed to load playlist types.</div>
        )}
        <FormField
          control={form.control}
          name='playlistTypeId'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Playlist Type</FormLabel>
              <FormControl>
                <Select {...field} disabled={isFetching}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a playlist type' />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    {data?.map((type: PlaylistTypeOptions) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            ) : (
              actionType
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default AssignUpdatePlaylistTypeForm;

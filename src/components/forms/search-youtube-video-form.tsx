'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { searchYouTubeVideoSchema } from '@/lib/schemas';
import { useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

import { z } from 'zod';
import { extractVideoId } from '@/lib/utils';
import { VideoData } from '@/types';
import { fetchVideoData } from '@/lib/actions/video';

interface SearchYouTubeVideoFormProps {
  onVideoSelect: (video: VideoData) => void;
  isSuccessfullyAdded: boolean;
  onNewSearch: () => void;
}

const SearchYouTubeVideoForm = ({
  onVideoSelect,
  isSuccessfullyAdded,
  onNewSearch
}: SearchYouTubeVideoFormProps) => {
  const [isPending, startTransition] = useTransition();
  // 1. Define your form.
  const form = useForm<z.infer<typeof searchYouTubeVideoSchema>>({
    resolver: zodResolver(searchYouTubeVideoSchema),
    defaultValues: {
      link: ''
    }
  });

  // clear input when isSuccessfullyAdded is true
  useEffect(() => {
    if (isSuccessfullyAdded) {
      form.reset({ link: '' });
    }
  }, [isSuccessfullyAdded, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof searchYouTubeVideoSchema>) {
    // if there was a successful addition of a video, and the user is making a new search, we need to set isSuccessfullyAdded to false
    onNewSearch();
    // submit logic
    startTransition(async () => {
      try {
        // extract video ID
        const videoId = extractVideoId(values.link);

        if (!videoId) {
          toast.error('Invalid YouTube video link');
          return;
        }

        // get the video data from YouTube api
        const videoData = await fetchVideoData(videoId);
        if (!videoData) {
          toast.error('Video not found or is private');
          return;
        }


        onVideoSelect(videoData);

        toast.success(`Found video: ${videoData.title}`);
      } catch (err: any) {
        toast.error(err.message || 'Invalid YouTube video link');
      }
    });
  }

  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full items-center gap-2'
      >
        <FormField
          control={form.control}
          name='link'
          render={({ field }) => (
            <FormItem className='w-full flex-1'>
              <FormControl>
                <Input
                  placeholder='Paste YouTube link here'
                  autoComplete='off'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>
          {isLoading ? (
            <LoaderCircle className='h-4 w-4 animate-spin' />
          ) : (
            'Search'
          )}
        </Button>
      </form>
    </Form>
  );
};
export default SearchYouTubeVideoForm;

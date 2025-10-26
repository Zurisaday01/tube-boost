'use client';

import Link from 'next/link';
import {  ExternalLink, Loader2, Tag } from 'lucide-react';
import PageContainer from '../layout/page-container';
import YouTubeNotes from '../notes/youtube-notes';
import { useEffect, useState, useCallback, useTransition } from 'react';
import {
  cn,
  handleActionResponse,
} from '@/lib/utils';
import { toast } from 'sonner';
import { getPlaylistVideoNote } from '@/lib/actions/playlist-video-note';
import { BlockNoteEditor } from '@blocknote/core';
import SelectTagOptions from '../tag/select-tag-options';
import { ComboboxDataItem } from '@/types';
import { removeTagFromVideo } from '@/lib/actions/tag';
import VideoTagsList from '../tag/video-tags-list';
import { VideoTagWithTag } from '@/types/actions';

interface VideoPageClientProps {
  youtubeVideoId: string;
  title: string;
  channelTitle: string;
  playlistVideoId: string;
  tagOptions: Record<string, ComboboxDataItem[]>;
  videoTags: VideoTagWithTag[];
}

const LoaderPage = ({ isVideoLoading }: { isVideoLoading: boolean }) => (
  <div
    className={cn(
      'absolute inset-0 z-30 flex min-h-[90vh] w-full flex-col items-center justify-center gap-2 bg-white dark:bg-black',
      isVideoLoading ? 'opacity-100' : 'pointer-events-none opacity-0'
    )}
  >
    <Loader2 className='mr-2 size-6 animate-spin' />
    <span className='ml-1'> Loading...</span>
  </div>
);

const VideoPageClient = ({
  playlistVideoId,
  youtubeVideoId, // NOTE: External YouTube video ID from YouTube API
  title,
  channelTitle,
  tagOptions,
  videoTags
}: VideoPageClientProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [initialEditorContent, setInitialEditorContent] = useState<
    BlockNoteEditor['document'] | null
  >(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTagId(tagId);
    startTransition(async () => {
      try {
        const response = await removeTagFromVideo(tagId, playlistVideoId);

        handleActionResponse(response, () => {
          // To clear the selected tag after removal
          setSelectedTagId(null);
        });
      } catch (err) {
        toast.error('Failed to remove tag from video.');
      }
    });
  };

  const loadNote = useCallback(async () => {
    try {
      const { status, message, data } =
        await getPlaylistVideoNote(playlistVideoId);
      if (status === 'success') {
        const note = data;
        if (note?.document) {
          // Since it is stored as JSON, we need to parse it
          const parsedDocument = JSON.parse(note.document as string);
          const clonedDocument = JSON.parse(JSON.stringify(parsedDocument));
          setInitialEditorContent(clonedDocument);
        }
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error('Error fetching initial notes:', err);
      toast.error('Failed to load initial notes.');
    }
  }, [playlistVideoId]);

  // Load initial note on mount
  useEffect(() => {
    loadNote();
  }, [loadNote]);

  return (
    <PageContainer>
      {/* Overlay loader */}
      <LoaderPage isVideoLoading={isVideoLoading} />

      <section className='flex w-full flex-col gap-6'>
        <h1 className='text-2xl font-bold'>{title}</h1>

        <div>
          <p className='text-muted-foreground mt-2'>
            This video belongs to{' '}
            <span className='text-primary font-semibold'>{channelTitle}</span>{' '}
            on{' '}
            <Link
              href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary inline-flex items-center gap-1 transition-all duration-150 hover:underline'
            >
              <span>YouTube</span>
              <ExternalLink className='inline size-3' />
            </Link>
          </p>
        </div>
        <div className='w-full'>
          <YouTubeNotes
            initialEditorContent={initialEditorContent}
            playlistVideoId={playlistVideoId}
            videoId={youtubeVideoId}
            onVideoLoad={handleVideoLoad}
          />
        </div>

        <SelectTagOptions
          tagOptions={tagOptions}
          playlistVideoId={playlistVideoId}
        />

        <VideoTagsList
          videoTags={videoTags}
          selectedTagId={selectedTagId}
          isPending={isPending}
          onTagRemove={handleTagRemove}
        />
      </section>
    </PageContainer>
  );
};
export default VideoPageClient;

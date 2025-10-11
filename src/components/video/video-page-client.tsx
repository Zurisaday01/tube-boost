'use client';

import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import PageContainer from '../layout/page-container';
import YouTubeNotes from '../notes/youtube-notes';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getPlaylistVideoNote } from '@/lib/actions/playlist-video-note';
import { BlockNoteEditor } from '@blocknote/core';
import { useCallback } from 'react';

interface VideoPageClientProps {
  youtubeVideoId: string;
  dbVideoId: string;
  title: string;
  channelTitle: string;
  playlistVideoId: string;
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
  dbVideoId,
  youtubeVideoId, // NOTE: External YouTube video ID from YouTube API
  title,
  channelTitle
}: VideoPageClientProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [initialEditorContent, setInitialEditorContent] = useState<
    BlockNoteEditor['document'] | null
  >(null);
  const blockNoteViewRef = useRef<HTMLDivElement | null>(null);

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  const loadNote = useCallback(async () => {
    try {
      const note = await getPlaylistVideoNote(playlistVideoId);
      if (note?.document) {
        // Since it is stored as JSON, we need to parse it
        const parsedDocument = JSON.parse(note.document as string);
        const clonedDocument = JSON.parse(JSON.stringify(parsedDocument));
        setInitialEditorContent(clonedDocument);
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
            blockNoteViewRef={blockNoteViewRef}
            initialEditorContent={initialEditorContent}
            dbVideoId={dbVideoId}
            playlistVideoId={playlistVideoId}
            videoId={youtubeVideoId}
            onVideoLoad={handleVideoLoad}
          />
        </div>
      </section>
    </PageContainer>
  );
};
export default VideoPageClient;

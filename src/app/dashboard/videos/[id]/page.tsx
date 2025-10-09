import PageContainer from '@/components/layout/page-container';
import YouTubeNotes from '@/components/notes/youtube-notes';
import { getPlaylistVideoById } from '@/lib/actions/video';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

type PageProps = { params: Promise<{ id: string }> };

const VideoDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const playlistVideo = await getPlaylistVideoById(id);

  if (!playlistVideo) {
    return <div>Video not found or you do not have access to it.</div>;
  }

  const {
    id: videoId,
    youtubeVideoId,
    channelTitle,
    duration,
    thumbnails,
    title
  } = playlistVideo.video;

  return (
    <PageContainer>
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
          <YouTubeNotes videoId={youtubeVideoId} />
        </div>
      </section>
    </PageContainer>
  );
};
export default VideoDetailsPage;

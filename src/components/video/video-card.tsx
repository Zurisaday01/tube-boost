import { cn, formatDuration, formatLocalDate } from '@/lib/utils';
import { Subcategory, VideoThumbnails } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import PlaylistVideoOptionsMenu from './playlist-video-options-menu';

interface VideoCardProps {
  id: string;
  title: string;
  youtubeVideoId: string;
  channelTitle: string;
  duration: number; // in seconds
  thumbnails: VideoThumbnails;
  addedAt: Date;
  reorderMode: boolean; // to indicate if in reorder mode
  subcategories?: Subcategory[];
  // subcategories is only needed when not in reorder mode for the options menu (sortable video card does not pass it)
}

const VideoCard = ({
  id,
  title,
  channelTitle,
  duration,
  thumbnails,
  addedAt,
  reorderMode,
  youtubeVideoId,
  subcategories
}: VideoCardProps) => {
  const cardContent = (
    <>
      <div className='relative mb-2 h-[230px] overflow-hidden rounded-md bg-gray-200'>
        <Image
          src={thumbnails.maxres?.url || thumbnails.high.url}
          alt={title}
          fill
          className='object-cover'
        />
      </div>
      <header className='flex items-center gap-2'>
        <h2 className='font-bold'>{title}</h2>
        {!reorderMode && subcategories ? (
          <PlaylistVideoOptionsMenu
            id={id}
            title={title}
            subcategories={subcategories}
          />
        ) : null}
      </header>

      <p className='text-muted-foreground text-sm'>{channelTitle}</p>
      <p className='text-muted-foreground text-sm'>
        Duration: {formatDuration(duration)}
      </p>
      <p className='text-muted-foreground text-sm'>
        Added At: {formatLocalDate(addedAt.toISOString().slice(0, 10))}
      </p>
    </>
  );

  return (
    <div
      className={cn(
        'rounded-md p-2 transition-colors duration-150',
        reorderMode
          ? 'cursor-move border-2 border-dashed border-red-200'
          : 'hover:bg-accent/60'
      )}
    >
      {reorderMode ? (
        cardContent
      ) : (
        <Link href={`/dashboard/videos/${id}`}>{cardContent}</Link>
      )}

      {!reorderMode && (
        <Link
          href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-red-500 hover:underline'
        >
          Watch on YouTube
        </Link>
      )}
    </div>
  );
};

export default VideoCard;

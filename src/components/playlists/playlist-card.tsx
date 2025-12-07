'use client';
import { formatLocalDate } from '@/lib/utils';
import { Music } from 'lucide-react';
import Link from 'next/link';
import PlaylistOptionsMenu from './playlist-options-menu';
import { PlaylistType } from '@prisma/client';
import dynamic from 'next/dynamic';
import SkeletonColorChangeTag from '../color-change-tag/skeleton-change-tag';

const PlaylistTypeTag = dynamic(
  () => import('../playlist-type/playlist-type-tag'),
  {
    ssr: false,
    loading: () => <SkeletonColorChangeTag />
  }
);

interface PlaylistCardProps {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  totalVideos: number;
  totalCategories: number;
  playlistType: null | PlaylistType;
}

const PlaylistCard = ({
  id,
  title,
  createdAt,
  updatedAt,
  totalVideos,
  totalCategories,
  playlistType
}: PlaylistCardProps) => {
  return (
    <Link href={`/dashboard/playlists/${id}`}>
      <div className='group hover:bg-accent/60 dark:hover:bg-accent/80 rounded-md p-2 transition-colors duration-150'>
        <div className='relative flex h-[200px] items-center justify-center rounded-md bg-gray-200 dark:bg-neutral-800 p-4 transition-colors duration-150 group-hover:bg-gray-300'>
          <Music className='size-20 text-gray-400' />

          <div className='absolute top-2 left-1'>
            <PlaylistTypeTag playlistType={playlistType} />
          </div>
        </div>
        <div className='flex flex-col pt-4'>
          <header className='flex items-center gap-2'>
            <h3 className='group-hover:text-primary text-lg font-semibold transition-colors duration-150'>
              {title}
            </h3>
            <PlaylistOptionsMenu
              id={id}
              title={title}
              playlistType={playlistType}
            />
          </header>

          <p className='text-muted-foreground text-sm'>
            Created at: {formatLocalDate(createdAt.toISOString().slice(0, 10))}
          </p>
          <p className='text-muted-foreground text-sm'>
            Updated at: {formatLocalDate(updatedAt.toISOString().slice(0, 10))}
          </p>
          <p className='text-muted-foreground text-sm'>
            Total videos: {totalVideos}
          </p>
          <p className='text-muted-foreground text-sm'>
            Total categories: {totalCategories}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default PlaylistCard;

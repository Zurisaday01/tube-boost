import { formatLocalDate } from '@/lib/utils';
import { Music } from 'lucide-react';
import Link from 'next/link';
import PlaylistOptionsMenu from './playlist-options-menu';
import { PlaylistType } from '@prisma/client';
import PlaylistTypeTag from '../playlist-type/playlist-type-tag';

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
      <div className='group'>
        <div className='flex h-[200px] items-center justify-center rounded-md bg-gray-200 p-4 transition-colors duration-150 group-hover:bg-gray-300 relative'>
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

          <p>
            Created at: {formatLocalDate(createdAt.toISOString().slice(0, 10))}
          </p>
          <p>
            Updated at: {formatLocalDate(updatedAt.toISOString().slice(0, 10))}
          </p>
          <p>Total videos: {totalVideos}</p>
          <p>Total categories: {totalCategories}</p>
        </div>
      </div>
    </Link>
  );
};
export default PlaylistCard;

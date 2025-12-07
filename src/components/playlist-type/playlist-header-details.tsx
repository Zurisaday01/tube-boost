'use client';

import dynamic from 'next/dynamic';
import SkeletonColorChangeTag from '../color-change-tag/skeleton-change-tag';
import { PlaylistWithStatsAndUncategorizedVideos } from '@/types/actions';
import CreateSubcategoryButton from '../dialog/create-subcategory-button';
import { Music } from 'lucide-react';

const PlaylistTypeTag = dynamic(
  () => import('@/components/playlist-type/playlist-type-tag'),
  {
    ssr: false,
    loading: () => <SkeletonColorChangeTag />
  }
);

interface PlaylistHeaderDetailsProps {
  playlist: PlaylistWithStatsAndUncategorizedVideos;
}

const PlaylistHeaderDetails = ({ playlist }: PlaylistHeaderDetailsProps) => {
  return (
    <header className='mb-6 flex items-center gap-4'>
      <div className='flex size-[200px] items-center justify-center rounded-md bg-gray-200 dark:bg-neutral-800 p-4 transition-colors duration-150 group-hover:bg-gray-300'>
        <Music className='size-20 text-gray-400' />
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>{playlist.title}</h1>
        <p>Total Videos: {playlist.totalVideos}</p>
        <p>Total Categories: {playlist.totalCategories} </p>
        <div>
          <CreateSubcategoryButton playlistId={playlist.id} />
        </div>
        <PlaylistTypeTag playlistType={playlist.playlistType} isCard={false} />
      </div>
    </header>
  );
};
export default PlaylistHeaderDetails;

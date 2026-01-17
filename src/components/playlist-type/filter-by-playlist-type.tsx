'use client';
import { PlaylistType } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import SkeletonColorChangeTag from '../color-change-tag/skeleton-change-tag';
import dynamic from 'next/dynamic';

const PlaylistTypeTag = dynamic(() => import('./playlist-type-tag'), {
  ssr: false,
  loading: () => <SkeletonColorChangeTag />
});

interface FilterByPlaylistTypeProps {
  playlistTypes: PlaylistType[];
  onSelect: (id: string) => void;
  onClear: () => void;
}

const FilterByPlaylistType = ({
  playlistTypes,
  onSelect,
  onClear
}: FilterByPlaylistTypeProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-lg font-semibold'>Filter by Playlist Type</h2>
      <div className='flex gap-2'>
        <Button
          className='cursor-pointer rounded-full'
          variant='outline'
          onClick={() => onClear()}
        >
          All
        </Button>
        {playlistTypes &&
          playlistTypes.length !== 0 &&
          playlistTypes.map((type) => (
            <button
              key={type.id}
              className='cursor-pointer'
              onClick={() => onSelect(type.id)}
            >
              <PlaylistTypeTag playlistType={type} isCard={false} />
            </button>
          ))}
      </div>
    </div>
  );
};
export default FilterByPlaylistType;

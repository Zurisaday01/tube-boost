'use client';
import { PlaylistType } from '@prisma/client';
import PlaylistTypeTag from './playlist-type-tag';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';

interface FilterByPlaylistTypeProps {
  playlistTypes: PlaylistType[];
}

const FilterByPlaylistType = ({ playlistTypes }: FilterByPlaylistTypeProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Set or replace the playlist-type param
    params.set('playlist-type', id);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-lg font-semibold'>Filter by Playlist Type</h2>
      <div className='flex gap-2'>
        <Button
          className='cursor-pointer rounded-full'
          variant='outline'
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('playlist-type');
            router.push(`?${params.toString()}`);
          }}
        >
          All
        </Button>
        {playlistTypes &&
          playlistTypes.length !== 0 &&
          playlistTypes.map((type) => (
            <button
              key={type.id}
              className='cursor-pointer'
              onClick={() => handleSelect(type.id)}
            >
              <PlaylistTypeTag playlistType={type} />
            </button>
          ))}
      </div>
    </div>
  );
};
export default FilterByPlaylistType;

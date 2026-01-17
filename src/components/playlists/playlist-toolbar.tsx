'use client';
import FilterByPlaylistType from '../playlist-type/filter-by-playlist-type';
import { PlaylistType } from '@prisma/client';
import SortByPlaylist from './sort-by-playlist';
import { useRouter, useSearchParams } from 'next/navigation';

interface PlaylistToolbarProps {
  playlistTypes: PlaylistType[];
}

const PlaylistToolbar = ({ playlistTypes }: PlaylistToolbarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current sortBy param to avoid an uncontrolled select component
  const currentSortBy = searchParams.get('sort-by') ?? 'default';

  const handleSelectPlaylistType = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Set or replace the playlist-type param
    params.set('playlist-type', id);

    // remove page param to reset pagination
    params.delete('page');

    router.push(`?${params.toString()}`);
  };

  const handleClearPlaylistType = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('playlist-type');
    router.push(`?${params.toString()}`);
  };

  const handleClearSortBy = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('sort-by');
    router.push(`?${params.toString()}`);
  };

  const handleSelectSortBy = (sortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort-by', sortBy);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
      <FilterByPlaylistType
        playlistTypes={playlistTypes}
        onSelect={handleSelectPlaylistType}
        onClear={handleClearPlaylistType}
      />
      <SortByPlaylist
        onClear={handleClearSortBy}
        onSelect={handleSelectSortBy}
        value={currentSortBy}
      />
    </div>
  );
};
export default PlaylistToolbar;

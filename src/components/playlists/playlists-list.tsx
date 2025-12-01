import { PlaylistWithStats } from '@/types/actions';
import PlaylistCard from './playlist-card';

interface PlaylistsListProps {
  playlists: PlaylistWithStats[];
}

const PlaylistsList = ({ playlists }: PlaylistsListProps) => {
  // Handle empty playlists case
  if (playlists.length === 0) {
    return <p className='text-muted-foreground'>Put together a playlist!</p>;
  }

  // Render the list of playlists
  return (
    <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          id={playlist.id}
          title={playlist.title}
          playlistType={playlist.playlistType}
          createdAt={playlist.createdAt}
          updatedAt={playlist.updatedAt}
          totalVideos={playlist.totalVideos}
          totalCategories={playlist.totalCategories}
        />
      ))}
    </div>
  );
};
export default PlaylistsList;

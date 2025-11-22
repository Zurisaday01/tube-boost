import { PlaylistWithStats } from '@/types/actions';
import PlaylistCard from './playlist-card';

interface PlaylistsListProps {
  playlists: PlaylistWithStats[] | undefined;
}

const PlaylistsList = ({ playlists }: PlaylistsListProps) => {
  return (
    <div className='w-full grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {playlists?.map((playlist) => (
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

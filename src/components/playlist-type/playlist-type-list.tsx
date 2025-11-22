import type { PlaylistType } from '@prisma/client';
import PlaylistTypeCard from './playlist-type-card';

interface PlaylistTypeListProps {
  playlistTypes: PlaylistType[];
}

const PlaylistTypeList = ({ playlistTypes }: PlaylistTypeListProps) => {
  if (playlistTypes.length === 0) {
    return (
      <div className='text-muted-foreground'>
        You have no playlist types. Start by creating one!
      </div>
    );
  }

  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {playlistTypes.map((playlistType) => (
        <PlaylistTypeCard
          key={playlistType.id}
          id={playlistType.id}
          name={playlistType.name}
          description={playlistType.description || ''}
          color={playlistType.color}
          details={{
            modified: playlistType.updatedAt,
            created: playlistType.createdAt
          }}
        />
      ))}
    </div>
  );
};
export default PlaylistTypeList;

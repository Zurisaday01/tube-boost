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
    <div className='mt-8 grid w-full grid-cols-[repeat(auto-fit,250px)] gap-x-3 gap-y-8'>
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

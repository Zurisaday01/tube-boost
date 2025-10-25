import PageContainer from '@/components/layout/page-container';
import PlaylistCard from '@/components/playlists/playlist-card';
import { getAllPlaylists } from '@/lib/actions/playlist';

const PlaylistsPage = async () => {
  const { status, message, data: playlists } = await getAllPlaylists();

  if (status === 'error') {
    return (
      <div>
        {message === 'User not authenticated.'
          ? 'Please sign in to view your playlists.'
          : 'Failed to load playlists.'}
      </div>
    );
  }

  return (
    <PageContainer>
      <section className='flex flex-col gap-6'>
        <h1 className='text-2xl font-bold'>Your Playlists</h1>

        {/* Grid container */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
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
      </section>
    </PageContainer>
  );
};
export default PlaylistsPage;

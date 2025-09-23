import PageContainer from '@/components/layout/page-container';
import PlaylistCard from '@/components/playlists/playlist-card';
import { getAllPlaylists } from '@/lib/actions/playlist';

const PlaylistsPage = async () => {
  const playlists = await getAllPlaylists();

  return (
    <PageContainer>
      <section className='flex flex-col gap-6'>
        <h1 className='text-2xl font-bold'>Your Playlists</h1>

        <div>
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
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

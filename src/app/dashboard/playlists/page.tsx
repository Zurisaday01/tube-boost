import PageContainer from '@/components/layout/page-container';
import PlaylistsList from '@/components/playlists/playlists-list';
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
      <section className='flex flex-col gap-6 w-full'>
        <h1 className='text-2xl font-bold'>Your Playlists</h1>

        <PlaylistsList playlists={playlists} />
      </section>
    </PageContainer>
  );
};
export default PlaylistsPage;

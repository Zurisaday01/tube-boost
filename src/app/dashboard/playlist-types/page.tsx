import CreatePlaylistTypeButton from '@/components/dialog/create-playlist-type-button';
import PageContainer from '@/components/layout/page-container';
import PlaylistTypeList from '@/components/playlist-type/playlist-type-list';
import { getAllPlaylistTypes } from '@/lib/actions/playlist-type';

const PlaylistTypes = async () => {
  const { status, message, data: playlistTypes } = await getAllPlaylistTypes();

  if (status === 'error') {
    return (
      <div>
        {message === 'User not authenticated.'
          ? 'Please sign in to view your Playlist Types.'
          : 'Failed to load playlist types.'}
      </div>
    );
  }

  return (
    <PageContainer>
      <section className='flex w-full flex-col gap-6'>
        <header className='flex flex-col items-start gap-2'>
          <h1 className='text-2xl font-bold'>Your Playlist Types</h1>
          <CreatePlaylistTypeButton />
        </header>

        <PlaylistTypeList playlistTypes={playlistTypes ?? []} />
      </section>
    </PageContainer>
  );
};
export default PlaylistTypes;

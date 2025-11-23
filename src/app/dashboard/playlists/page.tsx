import PageContainer from '@/components/layout/page-container';
import FilterByPlaylistType from '@/components/playlist-type/filter-by-playlist-type';
import PlaylistsList from '@/components/playlists/playlists-list';
import { getAllPlaylists } from '@/lib/actions/playlist';
import { getAllPlaylistTypes } from '@/lib/actions/playlist-type';
import { isSuccess } from '@/lib/utils/actions';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const PlaylistsPage = async ({ searchParams }: PageProps) => {
  // Get the current search params
  const currentSearchParams = await searchParams;
  const playlistTypeParam = currentSearchParams['playlist-type'] as
    | string
    | undefined;

  const [playlistResponse, playlistTypesResponse] = await Promise.all([
    getAllPlaylists({ playlistTypeId: playlistTypeParam }),
    getAllPlaylistTypes()
  ]);

  const { status, message, data: playlists } = playlistResponse;
  const { data: playlistTypes } = playlistTypesResponse;

  if (!isSuccess(playlistResponse) || !isSuccess(playlistTypesResponse)) {
    let errorMsg = 'Failed to load playlists.';
    if (status === 'error' && message === 'User not authenticated.') {
      errorMsg = 'Please sign in to view your playlists.';
    }
    return <PageContainer>{errorMsg}</PageContainer>;
  }

  return (
    <PageContainer>
      <section className='flex w-full flex-col gap-6'>
        <h1 className='text-2xl font-bold'>Your Playlists</h1>

        <FilterByPlaylistType playlistTypes={playlistTypes || []} />

        <PlaylistsList playlists={playlists} />
      </section>
    </PageContainer>
  );
};
export default PlaylistsPage;

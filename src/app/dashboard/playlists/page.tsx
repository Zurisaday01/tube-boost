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

  // Extract playlist type filter from search params and ensure it's a string
  // (if multiple values are provided, ignore them)
  const rawPlaylistType = currentSearchParams['playlist-type'];
  const playlistTypeParam =
    typeof rawPlaylistType === 'string' ? rawPlaylistType : undefined;

  const [playlistResponse, playlistTypesResponse] = await Promise.all([
    getAllPlaylists({ playlistTypeId: playlistTypeParam }),
    getAllPlaylistTypes()
  ]);

  const { data: playlists } = playlistResponse;
  const { data: playlistTypes } = playlistTypesResponse;

  if (!isSuccess(playlistResponse) || !isSuccess(playlistTypesResponse)) {
    // Check if the error is due to unauthenticated user
    const unauthenticated =
      (!isSuccess(playlistResponse) &&
        playlistResponse.message === 'User not authenticated') ||
      (!isSuccess(playlistTypesResponse) &&
        playlistTypesResponse.message === 'User not authenticated.');

    // Show appropriate error message
    const errorMsg = unauthenticated
      ? 'Please sign in to view your playlists.'
      : 'Failed to load playlists.';
    return <PageContainer>{errorMsg}</PageContainer>;
  }

  return (
    <PageContainer>
      <section className='flex w-full flex-col gap-6'>
        <h1 className='text-2xl font-bold'>Your Playlists</h1>

        {playlistTypes && playlistTypes.length > 0 && (
          <FilterByPlaylistType playlistTypes={playlistTypes || []} />
        )}

        <PlaylistsList playlists={playlists} />
      </section>
    </PageContainer>
  );
};
export default PlaylistsPage;

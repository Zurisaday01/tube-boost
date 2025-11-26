import PageContainer from '@/components/layout/page-container';
import { PaginationFooter } from '@/components/pagination';
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

  // pagination params
  const rawPage = currentSearchParams.page;
  const page =
    rawPage && !isNaN(Number(rawPage)) && Number(rawPage) >= 1
      ? Math.floor(Number(rawPage))
      : 1;
  const rawPageSize = currentSearchParams.pageSize;
  const pageSize =
    rawPageSize && !isNaN(Number(rawPageSize)) && Number(rawPageSize) >= 1
      ? Math.floor(Number(rawPageSize))
      : 10;

  const [playlistResponse, playlistTypesResponse] = await Promise.all([
    getAllPlaylists({ playlistTypeId: playlistTypeParam, page, pageSize }),
    getAllPlaylistTypes()
  ]);

  const { data: { items: playlists, total } = { items: [], total: 0 } } =
    playlistResponse;
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
      <section className='flex min-h-[90vh] w-full flex-col gap-2'>
        <h1 className='text-2xl font-bold'>Your Playlists</h1>

        {playlistTypes && playlistTypes.length > 0 && (
          <FilterByPlaylistType playlistTypes={playlistTypes || []} />
        )}

        <div className='flex-1'>
          <PlaylistsList playlists={playlists} />
        </div>

        <PaginationFooter
          page={page}
          totalPages={Math.ceil(total / pageSize)}
          pageSize={pageSize}
          basePath='/dashboard/playlists'
        />
      </section>
    </PageContainer>
  );
};
export default PlaylistsPage;

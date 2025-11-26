import PageContainer from '@/components/layout/page-container';
import { PaginationFooter } from '@/components/pagination';
import PlaylistsList from '@/components/playlists/playlists-list';
import {
  getPlaylistCountByPlaylistType,
  getPlaylistTypeById
} from '@/lib/actions/playlist-type';
import { isSuccess } from '@/lib/utils/actions';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const PlaylistTypePage = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;
  const currentSearchParams = await searchParams;

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

  // Initiate both requests in parallel
  const [playlistTypeCountData, playlistTypeData] = await Promise.all([
    getPlaylistCountByPlaylistType({ id, page, pageSize }),
    getPlaylistTypeById(id)
  ]);

  if (!isSuccess(playlistTypeCountData) || !isSuccess(playlistTypeData)) {
    return <div>Failed to load data.</div>;
  }

  // Destructure the playlist type data
  const playlistCount = playlistTypeCountData.data;
  const playlistType = playlistTypeData.data;

  return (
    <PageContainer>
      <section className='flex min-h-[90vh] w-full flex-col gap-6'>
        <header className='flex flex-col items-start gap-2'>
          <h1 className='text-2xl font-bold'>
            All Playlists of Type{' '}
            <span className='text-primary'>{playlistType.name}</span>
          </h1>
          <div>
            <p className='text-muted-foreground text-sm'>
              Total Playlists: {playlistCount.count}
            </p>
          </div>
        </header>

        <div className='flex-1'>
          <PlaylistsList playlists={playlistCount.playlists.items} />
        </div>

        <PaginationFooter
          page={page}
          totalPages={Math.ceil(playlistCount.playlists.total / pageSize)}
          pageSize={pageSize}
          basePath={`/dashboard/playlist-types/${id}`}
        />
      </section>
    </PageContainer>
  );
};
export default PlaylistTypePage;

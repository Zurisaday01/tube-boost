import PageContainer from '@/components/layout/page-container';
import PlaylistsList from '@/components/playlists/playlists-list';
import {
  getPlaylistCountByPlaylistType,
  getPlaylistTypeById
} from '@/lib/actions/playlist-type';
import { isSuccess } from '@/lib/utils/actions';

type PageProps = { params: Promise<{ id: string }> };

const PlaylistTypePage = async ({ params }: PageProps) => {
  const { id } = await params;

  // Initiate both requests in parallel
  const [playlistTypeCountData, playlistTypeData] = await Promise.all([
    getPlaylistCountByPlaylistType(id),
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
      <section className='flex w-full flex-col gap-6'>
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

        <PlaylistsList playlists={playlistCount.playlists} />
      </section>
    </PageContainer>
  );
};
export default PlaylistTypePage;

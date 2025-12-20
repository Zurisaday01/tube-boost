import CreateSubcategoryButton from '@/components/dialog/create-subcategory-button';
import PageContainer from '@/components/layout/page-container';
import SearchVideoToAdd from '@/components/video/search-video-to-add';
import SubcategoriesList from '@/components/subcategories/subcategories-list';
import { getPlaylistById } from '@/lib/actions/playlist';
import { getAllSubcategories } from '@/lib/actions/subcategory';
import { isSuccess } from '@/lib/utils/actions';

import VideosDraggerContainer from '@/components/video/videos-dragger-container';
import PlaylistHeaderDetails from '@/components/playlist-type/playlist-header-details';

export const dynamic = 'force-dynamic';

const PlaylistPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  // asynchronous access of `params.id`.
  const { id } = await params;

  // Initiate both requests in parallel
  const [playlistResponse, subcategoriesResponse] = await Promise.all([
    getPlaylistById(id),
    getAllSubcategories(id)
  ]);

  if (!isSuccess(playlistResponse)) {
    return <div>Failed to load playlist.</div>;
  }

  if (!isSuccess(subcategoriesResponse)) {
    return <div>Failed to load subcategories.</div>;
  }

  const { data: playlist } = playlistResponse;
  const { data: subcategories } = subcategoriesResponse;

  return (
    <PageContainer>
      <section className='w-full'>
        <PlaylistHeaderDetails playlist={playlist} />

        <SearchVideoToAdd
          subcategories={subcategories}
          playlistId={playlist.id}
        />

        <SubcategoriesList subcategories={subcategories} />

        {playlist.uncategorizedPlaylistVideos.length > 0 && (
          <div className='mt-10'>
            <VideosDraggerContainer
              videos={playlist.uncategorizedPlaylistVideos}
              subcategories={subcategories}
            />
          </div>
        )}
      </section>
    </PageContainer>
  );
};
export default PlaylistPage;

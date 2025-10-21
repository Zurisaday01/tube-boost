import CreateSubcategoryButton from '@/components/dialog/create-subcategory-button';
import PageContainer from '@/components/layout/page-container';
import SearchVideoToAdd from '@/components/video/search-video-to-add';
import SubcategoriesList from '@/components/subcategories/subcategories-list';
import { getPlaylistById } from '@/lib/actions/playlist';
import { getAllSubcategories } from '@/lib/actions/subcategory';
import { Music } from 'lucide-react';
import { isSuccess } from '@/lib/utils/actions';

import VideosDraggerContainer from '@/components/video/videos-dragger-container';

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
        <header className='mb-6 flex items-center gap-4'>
          <div className='flex size-[200px] items-center justify-center rounded-md bg-gray-200 p-4 transition-colors duration-150 group-hover:bg-gray-300'>
            <Music className='size-20 text-gray-400' />
          </div>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>{playlist.title}</h1>
            <p>Total Videos: {playlist.totalVideos}</p>
            <p>Total Categories: {playlist.totalCategories} </p>
            <div>
              <CreateSubcategoryButton playlistId={playlist.id} />
            </div>
          </div>
        </header>
        <SearchVideoToAdd
          subcategories={subcategories}
          playlistId={playlist.id}
        />
        <SubcategoriesList subcategories={subcategories} />

        {playlist.uncategorizedPlaylistVideos.length > 0 && (
          <div className='mt-10'>
            <VideosDraggerContainer
              videos={playlist.uncategorizedPlaylistVideos}
            />
          </div>
        )}
      </section>
    </PageContainer>
  );
};
export default PlaylistPage;

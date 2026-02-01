import CreateSubcategoryButton from '@/components/dialog/create-subcategory-button';
import PageContainer from '@/components/layout/page-container';
import SearchVideoToAdd from '@/components/video/search-video-to-add';
import SubcategoriesList from '@/components/subcategories/subcategories-list';
import { getPlaylistById } from '@/lib/actions/playlist';
import { getAllSubcategories } from '@/lib/actions/subcategory';
import { isSuccess } from '@/lib/utils/actions';

import VideosDraggerContainer from '@/components/video/videos-dragger-container';
import PlaylistHeaderDetails from '@/components/playlist-type/playlist-header-details';
import { PaginationFooter } from '@/components/pagination';
import { normalizeInt } from '@/lib/utils/pagination';
import { MAX_PAGE_SIZE } from '@/constants/pagination';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string; subcategoryId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const PlaylistPage = async ({ params, searchParams }: PageProps) => {
  // asynchronous access of `params.id`.
  const { id } = await params;
  const currentSearchParams = await searchParams;

  // pagination params
  const rawPage = currentSearchParams.page;
  const page = normalizeInt(rawPage, 1);
  const pageSize = Math.min(
    normalizeInt(currentSearchParams.pageSize, 10),
    MAX_PAGE_SIZE
  );

  // Initiate both requests in parallel
  const [playlistResponse, subcategoriesResponse] = await Promise.all([
    getPlaylistById({
      id,
      page,
      pageSize
    }),
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
          <div className='flex flex-col gap-6 pb-10'>
            <div className='mt-10'>
              <VideosDraggerContainer
                key={`${playlist.uncategorizedPlaylistVideos.length}-${playlist.updatedAt}`}
                breadcrumbInfo={{
                  parentId: playlist.id,
                  parentName: playlist.title,
                  parentType: 'playlist'
                }}
                videos={playlist.uncategorizedPlaylistVideos}
                subcategories={subcategories}
              />
            </div>
            <div className='mb-10'>
              <PaginationFooter
                page={page}
                totalPages={Math.ceil(playlist.totalVideos / pageSize)}
                pageSize={pageSize}
                basePath={`/dashboard/playlists/${id}`}
              />
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
};
export default PlaylistPage;

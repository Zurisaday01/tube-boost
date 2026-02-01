import PageContainer from '@/components/layout/page-container';
import { PaginationFooter } from '@/components/pagination';
import VideosDraggerContainer from '@/components/video/videos-dragger-container';
import {
  getAllSubcategories,
  getSubcategoryById
} from '@/lib/actions/subcategory';
import { searchParams } from '@/lib/searchparams';
import { isSuccess } from '@/lib/utils/actions';
import { Folder } from 'lucide-react';
import { hasher } from 'node-object-hash';

type PageProps = {
  params: Promise<{ id: string; subcategoryId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const SubcategoryPage = async ({ params, searchParams }: PageProps) => {
  // Get the current search params
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

  // the first one belongs to the playlist, the second to the subcategory
  const { id, subcategoryId } = await params;

  // Initiate both requests in parallel
  const [subcategoryResponse, subcategoriesResponse] = await Promise.all([
    getSubcategoryById({
      subcategoryId,
      page,
      pageSize
    }),
    getAllSubcategories(id)
  ]);

  if (!isSuccess(subcategoryResponse) || !isSuccess(subcategoriesResponse)) {
    return <div>Failed to load subcategory.</div>;
  }

  const { data: subcategory } = subcategoryResponse;
  const { data: subcategories } = subcategoriesResponse;
  // Generate a stable hash for the user ID to use as a key
  const videoHashKey = hasher().hash({
    videos: subcategory.videos.map((v) => v.id)
  });

  return (
    <PageContainer>
      <section className='w-full'>
        <header className='mb-6 flex items-center gap-4'>
          <div className='flex size-[200px] items-center justify-center rounded-md bg-gray-200 dark:bg-neutral-800 p-4 transition-colors duration-150 group-hover:bg-gray-300'>
            <Folder className='size-20 text-gray-400' />
          </div>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>{subcategory.name}</h1>
            <p>Total Videos: {subcategory.totalVideos}</p>
            <div>{/* TODO: Implement add description */}</div>
          </div>
        </header>

        <div className='flex flex-col gap-6 pb-10'>
          <VideosDraggerContainer
            key={videoHashKey}
            breadcrumbInfo={{
              parentId: subcategory.id,
              additionalId: id, // playlist id
              parentName: subcategory.name,
              parentType: 'subcategory'
            }}
            videos={subcategory.videos}
            subcategoryId={subcategory.id}
            subcategories={subcategories}
          />
          <div className='mb-10'>
            <PaginationFooter
              page={page}
              totalPages={Math.ceil(subcategory.totalVideos / pageSize)}
              pageSize={pageSize}
              basePath={`/dashboard/playlists/${id}/subcategory/${subcategoryId}`}
            />
          </div>
        </div>
      </section>
    </PageContainer>
  );
};
export default SubcategoryPage;

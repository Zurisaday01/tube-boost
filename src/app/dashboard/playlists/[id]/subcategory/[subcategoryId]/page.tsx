import PageContainer from '@/components/layout/page-container';
import VideosDraggerContainer from '@/components/video/videos-dragger-container';
import {
  getAllSubcategories,
  getSubcategoryById
} from '@/lib/actions/subcategory';
import { isSuccess } from '@/lib/utils/actions';
import { Folder } from 'lucide-react';
import { hasher } from 'node-object-hash';

type PageProps = { params: Promise<{ id: string; subcategoryId: string }> };

const SubcategoryPage = async ({ params }: PageProps) => {
  // the first one belongs to the playlist, the second to the subcategory
  const { id, subcategoryId } = await params;

  // Initiate both requests in parallel
  const [subcategoryResponse, subcategoriesResponse] = await Promise.all([
    getSubcategoryById(subcategoryId),
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
          <div className='flex size-[200px] items-center justify-center rounded-md bg-gray-200 p-4 transition-colors duration-150 group-hover:bg-gray-300'>
            <Folder className='size-20 text-gray-400' />
          </div>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>{subcategory.name}</h1>
            <p>Total Videos: {subcategory.totalVideos}</p>
            <div>{/* TODO: Implement add description */}</div>
          </div>
        </header>
        <VideosDraggerContainer
          key={videoHashKey}
          videos={subcategory.videos}
          subcategoryId={subcategory.id}
          subcategories={subcategories}
        />
      </section>
    </PageContainer>
  );
};
export default SubcategoryPage;

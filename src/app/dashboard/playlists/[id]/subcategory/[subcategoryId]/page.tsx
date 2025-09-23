import PageContainer from '@/components/layout/page-container';
import VideosDraggerContainer from '@/components/video/videos-dragger-container';
import { getSubcategoryById } from '@/lib/actions/subcategory';
import { PlaylistVideo } from '@/types';
import { Folder } from 'lucide-react';

type PageProps = { params: Promise<{ subcategoryId: string }> };

const SubcategoryPage = async ({ params }: PageProps) => {
  const { subcategoryId } = await params;

  const subcategory = await getSubcategoryById(subcategoryId);

  if (!subcategory) {
    return <div>Subcategory not found</div>;
  }

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
          videos={subcategory.videos as unknown as PlaylistVideo[]}
          subcategoryId={subcategory.id}
        />
      </section>
    </PageContainer>
  );
};
export default SubcategoryPage;

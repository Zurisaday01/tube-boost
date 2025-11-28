import CreateTagGroupButton from '@/components/dialog/create-tag-group-button';
import PageContainer from '@/components/layout/page-container';
import TagGroupsList from '@/components/tag-group/tag-groups-list';
import { getAllTagGroups } from '@/lib/actions/tag-group';

// Flag this page is dynamic and should not be statically optimized
export const dynamic = 'force-dynamic';

const TagGroupsPage = async () => {
  const { status, message, data: tagGroups } = await getAllTagGroups();

  if (status === 'error') {
    return (
      <div>
        {message === 'User not authenticated.'
          ? 'Please sign in to view your Tag Groups.'
          : 'Failed to load tag groups.'}
      </div>
    );
  }

  return (
    <PageContainer>
      <section className='flex w-full flex-col gap-6'>
        <header className='flex flex-col items-start gap-2'>
          <h1 className='text-2xl font-bold'>Your Tag Groups</h1>
          <CreateTagGroupButton />
        </header>

        <TagGroupsList tagGroups={tagGroups ?? []} />
      </section>
    </PageContainer>
  );
};
export default TagGroupsPage;

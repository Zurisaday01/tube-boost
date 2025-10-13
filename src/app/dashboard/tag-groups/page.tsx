import CreateTagGroupButton from '@/components/dialog/create-tag-group-button';
import PageContainer from '@/components/layout/page-container';
import TagGroupsList from '@/components/tag-group/tag-groups-list';
import { getAllTagGroups } from '@/lib/actions/tag-group';

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
      <section className='flex flex-col gap-6 w-full'>
        <header className='flex flex-col gap-2 items-start'>
          <h1 className='text-2xl font-bold'>Your Tag Groups</h1>
          <CreateTagGroupButton />
        </header>

        <TagGroupsList tagGroups={tagGroups ?? []} />
      </section>
    </PageContainer>
  );
};
export default TagGroupsPage;

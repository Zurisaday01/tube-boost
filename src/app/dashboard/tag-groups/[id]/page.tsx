import CreateTagButton from '@/components/dialog/create-tag-button';
import PageContainer from '@/components/layout/page-container';
import TagsList from '@/components/tag/tags-list';
import { getTagsByTagGroup } from '@/lib/actions/tag';
import { getTagGroupById } from '@/lib/actions/tag-group';
import { isSuccess } from '@/lib/utils/actions';

type PageProps = { params: Promise<{ id: string }> };

const TagGroupPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const tagsByGroupAction = await getTagsByTagGroup(id);
  const tagGroupByIdAction = await getTagGroupById(id);

  // Initiate both requests in parallel
  const [tagsData, tagGroupData] = await Promise.all([
    tagsByGroupAction,
    tagGroupByIdAction
  ]);

  if (!isSuccess(tagsData) || !isSuccess(tagGroupData)) {
    return <div>Failed to load data.</div>;
  }

  // Destructure the playlist video data
  const tags = tagsData.data;
  const tagGroup = tagGroupData.data;

  return (
    <PageContainer>
      <section className='flex w-full flex-col gap-6'>
        <header className='flex flex-col items-start gap-2'>
          <h1 className='text-2xl font-bold'>
            Manage the tags for the group{' '}
            <span className='text-primary'>{tagGroup.name}</span>
          </h1>
          <CreateTagButton groupId={id} />
        </header>

        <TagsList tags={tags ?? []} />
      </section>
    </PageContainer>
  );
};
export default TagGroupPage;

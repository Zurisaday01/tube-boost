import { TagWithCount } from '@/types/actions';

interface TagsListProps {
  tags: TagWithCount[];
}

const TagsList = ({ tags }: TagsListProps) => {
  if (tags.length === 0) {
    return <div className='text-muted-foreground'>You have no tags.</div>;
  }

  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {tags.map((tag) => (
        <div
          key={tag.id}
          className='border-muted bg-card flex items-center justify-between rounded-md border p-4'
        >
          <span className='text-sm font-medium'>{tag.name}</span>
          <span className='text-muted-foreground text-xs'>
            {tag.totalVideos} video{tag.totalVideos !== 1 ? 's' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};
export default TagsList;

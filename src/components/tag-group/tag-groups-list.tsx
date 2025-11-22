import type { TagGroup } from '@prisma/client';
import TagGroupCard from './tag-group-card';

interface TagGroupsListProps {
  tagGroups: TagGroup[];
}

const TagGroupsList = ({ tagGroups }: TagGroupsListProps) => {
  if (tagGroups.length === 0) {
    return (
      <div className='text-muted-foreground'>
        You have no tag groups. Start by creating one!
      </div>
    );
  }

  return (
    <div className='mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {tagGroups.map((tagGroup) => (
        <TagGroupCard
          key={tagGroup.id}
          id={tagGroup.id}
          name={tagGroup.name}
          description={tagGroup.description || ''}
          color={tagGroup.color}
          details={{
            modified: tagGroup.updatedAt,
            created: tagGroup.createdAt
          }}
        />
      ))}
    </div>
  );
};
export default TagGroupsList;

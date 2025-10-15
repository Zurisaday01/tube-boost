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
    <div className='mt-8 grid w-full grid-cols-[repeat(auto-fit,250px)] gap-x-3 gap-y-8'>
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

import { Subcategory } from '@/types';
import SubcategoryCard from './subcategory-card';

const SubcategoriesList = ({
  subcategories
}: {
  subcategories: Subcategory[];
}) => {
  return (
    <div className='mt-8 grid grid-cols-[repeat(auto-fit,250px)] gap-x-3 gap-y-8'>
      {subcategories.map((subcategory) => (
        <SubcategoryCard
          key={subcategory.id}
          id={subcategory.id}
          name={subcategory.name}
          color={subcategory.color}
          details={{
            modified: subcategory.updatedAt,
            created: subcategory.createdAt,
            location: subcategory?.playlist?.title || 'Unknown'
          }}
          playlistId={subcategory.playlistId}
        />
      ))}
    </div>
  );
};
export default SubcategoriesList;
